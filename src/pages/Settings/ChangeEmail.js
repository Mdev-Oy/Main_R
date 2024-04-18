import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Button, Alert } from 'react-native';
import { signOut, signInWithEmailAndPassword, EmailAuthProvider, reauthenticateWithCredential, updateEmail, updatePassword, verifyBeforeUpdateEmail } from "firebase/auth";
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../../firebase';

const ChangeEmailModal = ({ visible, onClose }) => {
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

          onClose(); 
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
    <Modal animationType="none" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TextInput
            style={styles.input}
            placeholder="New Email"
            value={newEmail}
            onChangeText={setNewEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={oldPassword}
            onChangeText={setOldPassword}
            secureTextEntry
          />
          <View style={styles.buttonsContainer}>
            <Button title="Cancel" onPress={onClose} />
            <Button title="Confirm" onPress={changeEmail} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 10,
      width: '80%',
      alignItems: 'center',
    },
    input: {
      width: '100%',
      height: 40,
      borderWidth: 1,
      marginBottom: 10,
      paddingHorizontal: 10,
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      marginTop: 10,
    },
  });

export default ChangeEmailModal;
