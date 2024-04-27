import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Modal, Button, TextInput, useTheme } from 'react-native-paper';
import { signOut, signInWithEmailAndPassword, EmailAuthProvider, reauthenticateWithCredential, updateEmail, updatePassword, verifyBeforeUpdateEmail } from "firebase/auth";
import { doc, updateDoc } from 'firebase/firestore';

import { db, auth } from '../../../firebase';

export const ChangeEmailModal = ({ visible, onClose, onEmailChange }) => {

  const theme = useTheme();
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

        <View style={{
            backgroundColor: theme.colors.secondary,
            padding: 20,
            borderRadius: 5,
            alignItems: 'center',
        }}>
        <TextInput
            style={styles.input}
            textColor={theme.colors.onSurfaceVariant}
            placeholder="Email"
            value={newEmail}
            onChangeText={setNewEmail}
            secureTextEntry
            mode='outlined'
            activeOutlineColor={ theme.colors.outline }
            outlineStyle = {{ borderRadius: 5 }}
            contentStyle={{ backgroundColor: theme.colors.onPrimary }}
          />


          <TextInput
            style={styles.input}
            placeholder="Password"
            value={oldPassword}
            onChangeText={setOldPassword}
            secureTextEntry
            mode='outlined'
            activeOutlineColor={ theme.colors.outline }
            outlineStyle = {{ borderRadius: 5 }}
            contentStyle={{ backgroundColor: theme.colors.onPrimary }}
          />
          
          <View style={styles.buttonsContainer}>
            <Button 
            onPress={onClose} 
            buttonColor = {theme.colors.secondaryContainer}
            textColor = {theme.colors.onPrimary}
            rippleColor="#bababa"
            style={styles.item}> 
            Cancel 
            </Button>

            <Button 
            onPress={changeEmail} 
            buttonColor = {theme.colors.secondaryContainer}
            textColor = {theme.colors.onPrimary}
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


