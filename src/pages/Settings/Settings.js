import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Avatar, Card, IconButton, Button } from 'react-native-paper';
import { auth, db } from '../../../firebase';
import { signOut } from 'firebase/auth';
import { useNavigation } from "@react-navigation/native";
import ChangePasswordModal from './ChangePassword';
import ChangeEmailModal from './ChangeEmail';
import DeleteAccountModal from './DeleteAccount';
import { getDoc, doc } from 'firebase/firestore';


export const Settings = () => {
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const [changeEmailModalVisible, setChangeEmailModalVisible] = useState(false);
  const [deleteAccountModalVisible, setDeleteAccountModalVisible] = useState(false);
  const [focusedTime, setFocusedTime] = useState(0);

  const nav = useNavigation();
  const user = auth.currentUser;

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async() => {
    const userDocRef = doc(db, "users", user.uid);
    const data = await getDoc(userDocRef);

    if (data.exists()) {
      setFocusedTime(data.data().focusedTime);
    } else {
      setFocusedTime(0);
    }

  }


  const handleCloseChangePasswordModal = () => {
    setChangePasswordModalVisible(false);
  };

  const handleCloseChangeEmailModal = () => {
    setChangeEmailModalVisible(false);
  };

  const handleCloseDeleteAccountModal = () => {
    setDeleteAccountModalVisible(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      nav.navigate("Login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.info_container}>
        <Card.Title
          style={{borderRadius: 5}}
          title={user.email}
          titleStyle={{ fontSize: 15, color: '#FFFFFF'}}
          subtitle={`Focused time: ${focusedTime}`}
          subtitleStyle={{fontSize: 15, color: '#FFFFFF'}}
          left=
          {
            (props) => <Avatar.Icon {...props} 
          icon="account-cog" 
          color='#FFFFFF' 
          backgroundColor='transparent'
          size={50}/>
        }
        />
      </View>

      <View style={styles.button_container}>
      <Button 
        buttonColor="#202022"
        textColor='#FFFFFF'
        rippleColor="#bababa"
        style={styles.item} 
        onPress={() => setChangePasswordModalVisible(true)}>

          <Text> Change Password </Text>
      </Button>

      <Button 
        buttonColor="#202022"
        textColor='#FFFFFF'
        rippleColor="#bababa"
        style={styles.item} 
        onPress={() => setChangeEmailModalVisible(true)}>

          <Text>Change Email</Text>
      </Button>

      <Button 
        buttonColor="#202022"
        textColor='#FFFFFF'
        rippleColor="#bababa"
        style={styles.item} 
        onPress={() => setDeleteAccountModalVisible(true)}>

          <Text> Delete Account </Text>
      </Button>

      <Button 
        buttonColor="#202022"
        textColor='#FFFFFF'
        rippleColor="#bababa"
        style={styles.item} 
        onPress={() => handleLogout()}>

          <Text> Logout </Text>
      </Button>

      <ChangePasswordModal 
        visible={changePasswordModalVisible} 
        onClose={handleCloseChangePasswordModal} 
      />
      <ChangeEmailModal 
        visible={changeEmailModalVisible} 
        onClose={handleCloseChangeEmailModal} 
      />
      <DeleteAccountModal 
        visible={deleteAccountModalVisible} 
        onClose={handleCloseDeleteAccountModal} 
      />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#161618',
  },

  info_container: {
    alignItems: 'baseline',
    width: '80%',
    backgroundColor: '#202022',
    marginBottom: '5%'
  },

  button_container: {
    width: '80%',
    justifyContent: 'center',
  },

  item: {
    marginBottom: "2%",
    justifyContent: 'center',
    borderRadius: 5,
  },
});

