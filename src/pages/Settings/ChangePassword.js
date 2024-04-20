import React, { useState } from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import { Modal, Button, TextInput } from 'react-native-paper';
import { reauthenticateWithCredential, updatePassword, EmailAuthProvider } from 'firebase/auth';

import { auth, db } from '../../../firebase';


export const ChangePasswordModal = ({ visible, onClose, onPasswordChange }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');


  const changePassword = async () => {
    try {
      const user = auth.currentUser; 
      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      Alert.alert('Password updated successfully!');
      setOldPassword('');
      setNewPassword('');
      onPasswordChange();
      await signOut(auth);
      
    } catch (error) {
      console.error(error);

    }
  };

  return (
    <Modal visible={visible} onDismiss={onClose}>

        <View style={styles.modalContent}>
        <TextInput
            style={styles.input}
            placeholder="Current Password"
            value={oldPassword}
            onChangeText={setOldPassword}
            secureTextEntry
            mode='outlined'
            activeOutlineColor="#818181"
            outlineStyle = {{borderRadius: 5}}
            contentStyle={{backgroundColor: 'rgba(255, 255, 255, 1)'}}
          />


          <TextInput
            style={styles.input}
            placeholder="New Password (>8 chars)"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            mode='outlined'
            activeOutlineColor="#818181"
            outlineStyle = {{borderRadius: 5}}
            contentStyle={{backgroundColor: 'rgba(255, 255, 255, 1)'}}
          />
          
          <View style={styles.buttonsContainer}>
            <Button 
            onPress={onClose} 
            buttonColor="#1a1a1c"
            textColor='#FFFFFF'
            rippleColor="#bababa"
            style={styles.item}> 
            Cancel 
            </Button>

            <Button 
            onPress={changePassword} 
            buttonColor="#1a1a1c"
            textColor='#FFFFFF'
            rippleColor="#bababa"
            style={styles.item}> 
            Confirm 
            </Button>
            
          </View>
        </View>
    </Modal>
  );
};

const styles = StyleSheet.create({


  modalContent: {
    backgroundColor: '#202022',
    padding: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 35,
    marginBottom: 10,
    fontSize: 15
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },

  item: {
    marginBottom: "2%",
    justifyContent: 'center',
    borderRadius: 5,
  },
});


