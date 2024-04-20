import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Modal, Button, TextInput } from 'react-native-paper';
import { reauthenticateWithCredential, deleteUser, EmailAuthProvider } from 'firebase/auth';

import { auth } from '../../../firebase';

export const DeleteAccountModal = ({ visible, onClose, onAccountDeletion }) => {
  const [password, setPassword] = useState('');

  const deleteAccount = async () => {
    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);

      await deleteUser(user);
      await signOut(auth);
      Alert.alert('Account deleted!'); 
      onAccountDeletion();
      
    } catch (error) {
      console.error(error);

    }
  };

  return (
    <Modal visible={visible} onDismiss={onClose}>

        <View style={styles.modalContent}>
        <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
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
            onPress={deleteAccount} 
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


