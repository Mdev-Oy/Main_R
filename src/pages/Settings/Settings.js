import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Avatar, Card, IconButton, Button, useTheme } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";

import { ChangePasswordModal } from './ChangePassword';
import { ChangeEmailModal } from './ChangeEmail';
import { DeleteAccountModal } from './DeleteAccount';

import { getDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../../firebase';
import { signOut } from 'firebase/auth';



export const Settings = () => {

  const theme = useTheme();

  const [passModalVisible, setPassModalVisible] = useState(false);
  const [emailModalVisible, setEmailModalVisible] = useState(false);
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


  const handleCloseChangeEmailModal = () => {
    setEmailModalVisible(false);
  };

  const handleCloseDeleteAccountModal = () => {
    setDeleteAccountModalVisible(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      nav.navigate("Login");
    } catch (error) {
    }
  };

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background
    }}>
      <View style={{
        alignItems: 'baseline',
        width: '80%',
        backgroundColor: theme.colors.secondary,
        marginBottom: '5%'
      }}>
        <Card.Title
          style={{borderRadius: 5, }}
          title= 
          { 
          <Text>
            Email: <Text style={styles.boldText}> {user.email} </Text> 
          </Text>
          }
          titleStyle={{ fontSize: 14, color: theme.colors.onPrimary}}
          subtitle= 
          {
            <Text>
                Focused time: <Text style={styles.boldText}> {focusedTime} min. </Text> 
            </Text>
          }
          subtitleStyle={{fontSize: 14, color: theme.colors.onPrimary}}
          left=
          {
            (props) => <Avatar.Icon {...props} 
          icon="turtle" 
          color='#FFFFFF' 
          backgroundColor='transparent'
          size={50}
          />
        }
        />
      </View>

      <View style={styles.button_container}>
      <Button 
        buttonColor = { theme.colors.secondary }
        textColor = { theme.colors.onPrimary }
        rippleColor="#bababa"
        style={styles.item} 
        onPress={() => setPassModalVisible(true)}>

          <Text> Change Password </Text>
      </Button>

      <Button 
        buttonColor = { theme.colors.secondary }
        textColor = { theme.colors.onPrimary }
        rippleColor="#bababa"
        style={styles.item} 
        onPress={() => setEmailModalVisible(true)}>

          <Text>Change Email</Text>
      </Button>

      <Button 
        buttonColor = { theme.colors.secondary }
        textColor = { theme.colors.onPrimary }
        rippleColor="#bababa"
        style={styles.item} 
        onPress={() => setDeleteAccountModalVisible(true)}>

          <Text> Delete Account </Text>
      </Button>

      <Button 
        buttonColor = { theme.colors.secondary }
        textColor = { theme.colors.onPrimary }
        rippleColor="#bababa"
        style={styles.item} 
        onPress={() => handleLogout()}>

          <Text> Logout </Text>
      </Button>

      <ChangePasswordModal 
        visible={passModalVisible} 
        onClose={() => setPassModalVisible(false)}
        onPasswordChange={() => setPassModalVisible(false)} 
      />

      <ChangeEmailModal 
        visible={emailModalVisible} 
        onClose={() => setEmailModalVisible(false)}
        onEmailChange={() => setEmailModalVisible(false)}
      />
      <DeleteAccountModal 
        visible={deleteAccountModalVisible} 
        onClose={handleCloseDeleteAccountModal} 
        onAccountDeletion={() => setDeleteAccountModalVisible(false)}
      />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({


  button_container: {
    width: '80%',
    justifyContent: 'center',
  },

  item: {
    marginBottom: "2%",
    justifyContent: 'center',
    borderRadius: 5,
  },

  boldText: {
    fontWeight: 'bold'
 },

});

