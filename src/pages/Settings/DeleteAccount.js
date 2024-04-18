import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Button, Modal, Alert } from 'react-native';
import { reauthenticateWithCredential, deleteUser, EmailAuthProvider } from 'firebase/auth';

const DeleteAccountModal = ({ visible, onClose }) => {
  const [password, setPassword] = useState('');

  const deleteAccount = async () => {
    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);

      await deleteUser(user);
      Alert.alert('Account deleted!'); 
      onClose();
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
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <View style={styles.buttonsContainer}>
            <Button title="Cancel" onPress={onClose} />
            <Button title="Confirm" onPress={deleteAccount} />
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

export default DeleteAccountModal;
