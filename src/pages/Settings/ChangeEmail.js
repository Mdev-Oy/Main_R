import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Modal, Button, TextInput } from 'react-native-paper';
import { signOut, signInWithEmailAndPassword, EmailAuthProvider, reauthenticateWithCredential, updateEmail, updatePassword, verifyBeforeUpdateEmail } from "firebase/auth";
import { doc, updateDoc } from 'firebase/firestore';

import { db, auth } from '../../../firebase';

export const ChangeEmailModal = ({ visible, onClose, onEmailChange }) => {
  const [newEmail, setNewEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');

  const changeEmail = async () => {
    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      await reauthenticateWithCredential(user, credential);

      try {
        await signInWithEmailAndPassword(auth, newEmail, 'test_password'); 

      } catch (error) {
        if (error.code === 'auth/user-not-found') {
          await updateEmail(user, newEmail);
          Alert.alert('Email updated successfully!');

          await updateDoc(doc(db, "users", user.uid), {
            email: newEmail,
          });

          onEmailChange(); 
        } else {
          Alert.alert('Error', 'This email address might already be in use.');
        }
        return; 
      }

    } catch (error) {
      Alert.alert('Error', error.message); 
      console.error(error);
    }
  };

  return (
    <Modal visible={visible} onDismiss={onClose}>

        <View style={styles.modalContent}>
        <TextInput
            style={styles.input}
            placeholder="Email"
            value={newEmail}
            onChangeText={setNewEmail}
            secureTextEntry
            mode='outlined'
            activeOutlineColor="#818181"
            outlineStyle = {{borderRadius: 5}}
            contentStyle={{backgroundColor: 'rgba(255, 255, 255, 1)'}}
          />


          <TextInput
            style={styles.input}
            placeholder="Password"
            value={oldPassword}
            onChangeText={setOldPassword}
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
            onPress={changeEmail} 
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


