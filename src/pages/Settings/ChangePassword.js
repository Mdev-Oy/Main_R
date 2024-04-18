import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Button, Modal, Alert } from 'react-native';
import { auth, db } from '../../../firebase';
import { reauthenticateWithCredential, updatePassword, EmailAuthProvider } from 'firebase/auth';

const ChangePasswordModal = ({ visible, onClose }) => {
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
      onClose();  // Close the modal
    } catch (error) {
      console.error(error);

    }
  };

  return (
    <Modal animationType="none" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TextInput
            style={styles.input}
            placeholder="Old Password"
            value={oldPassword}
            onChangeText={setOldPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          <View style={styles.buttonsContainer}>
            <Button title="Cancel" onPress={onClose} />
            <Button title="Confirm" onPress={changePassword} />
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

export default ChangePasswordModal;
