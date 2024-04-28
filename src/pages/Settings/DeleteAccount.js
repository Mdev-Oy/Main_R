import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Modal, Button, TextInput, useTheme } from 'react-native-paper';


import { reauthenticateWithCredential, deleteUser, EmailAuthProvider } from 'firebase/auth';
import { updateDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../../firebase';



export const DeleteAccountModal = ({ visible, onClose, onAccountDeletion }) => {

  const theme = useTheme();
  const [password, setPassword] = useState('');
  const user = auth.currentUser;
  const userDocRef = doc(db, "users", user.uid);

  const deleteAccount = async () => {
    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);

      await updateDoc(userDocRef, {
        deleteRequest: true,
      });

      //manually: await deleteUser(user);
      await signOut(auth);
      Alert.alert('Account deleted!'); 
      onAccountDeletion();
      
    } catch (error) {
    }
  };

  return (
    <Modal visible={visible} onDismiss={onClose}>

        <View style={{
            backgroundColor: theme.colors.secondary,
            paddingHorizontal: 25,
            paddingVertical: 40,
            borderRadius: 5,
            alignItems: 'center',
        }}>

        <TextInput
            style={styles.input}
            textColor={theme.colors.onSurfaceVariant}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            mode='outlined'
            activeOutlineColor = {theme.colors.outline}
            outlineStyle = {{borderRadius: 5}}
            contentStyle={{backgroundColor: 'rgba(255, 255, 255, 1)'}}
          />

          
          <View style={styles.buttonsContainer}>
            <Button 
            onPress={onClose} 
            buttonColor = { theme.colors.tertiary }
            textColor = { theme.colors.onPrimary }
            rippleColor="#bababa"
            style={styles.item}> 
            Cancel 
            </Button>

            <Button 
            onPress={deleteAccount} 
            buttonColor = { theme.colors.tertiary }
            textColor = { theme.colors.onPrimary }
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


