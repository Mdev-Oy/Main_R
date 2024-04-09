import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Button, Alert } from 'react-native';
import { auth } from "../../firebase";
import { signOut, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { updatePassword, updateEmail } from 'firebase/auth';

export const Settings = () => {

  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const [changeEmailModalVisible, setChangeEmailModalVisible] = useState(false);
  const [deleteAccountModalVisible, setDeleteAccountModalVisible] = useState(false);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [deleteAccountPassword, setDeleteAccountPassword] = useState('');

  const nav = useNavigation();
  const user = auth.currentUser;

  const handleChangePassword = () => {
    setChangePasswordModalVisible(true);
  };

  const handleChangeEmail = () => {
    setChangeEmailModalVisible(true);
  };

  const handleDeleteAccount = () => {
    setDeleteAccountModalVisible(true);
  };

  const handleCloseChangePasswordModal = () => {
    setChangePasswordModalVisible(false);
    setOldPassword('');
    setNewPassword('');
  };

  const handleCloseChangeEmailModal = () => {
    setChangeEmailModalVisible(false);
    setNewEmail('');
  };

  const handleCloseDeleteAccountModal = () => {
    setDeleteAccountModalVisible(false);
    setDeleteAccountPassword('');
  };

  const handleConfirmChangePassword = async () => {
    try {
        const credential = EmailAuthProvider.credential(user.email, oldPassword);
        await reauthenticateWithCredential(user, credential);
        
        await updatePassword(user, newPassword);
        Alert.alert('Password updated successfully!');

        handleCloseChangePasswordModal();
        nav.navigate("Login")
      } catch (error) {
        console.error(error);
      }
  };

  const handleConfirmChangeEmail = () => {
    handleCloseChangeEmailModal();
  };

  const handleConfirmDeleteAccount = () => {

    Alert.alert('Account Deleted'); // should we really delete accounts or just mark them
    handleCloseDeleteAccountModal();
  };

  const handleLogout = async () => {
    try 
    {
        await signOut(auth)
        nav.navigate("Login");
    } 
    catch (error) {
        console.error(error);
    }

  };

  return (
    <View style={styles.container}>


      <TouchableOpacity style={styles.item} onPress={handleChangePassword}>
        <Text>Change Password</Text>
      </TouchableOpacity>


      <TouchableOpacity style={styles.item} onPress={handleChangeEmail}>
        <Text>Change Email</Text>
      </TouchableOpacity>


      <TouchableOpacity style={styles.item} onPress={handleDeleteAccount}>
        <Text>Delete Account</Text>
      </TouchableOpacity>


      <TouchableOpacity style={styles.item} onPress={handleLogout}>
        <Text>Logout</Text>
      </TouchableOpacity>

      <Modal
        animationType="none"
        transparent={true}
        visible={changePasswordModalVisible}
        onRequestClose={handleCloseChangePasswordModal}
      >
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
              <Button title="Cancel" onPress={handleCloseChangePasswordModal} />
              <Button title="Confirm" onPress={handleConfirmChangePassword} />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="none"
        transparent={true}
        visible={changeEmailModalVisible}
        onRequestClose={handleCloseChangeEmailModal}
      >
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
            />
            <View style={styles.buttonsContainer}>
              <Button title="Cancel" onPress={handleCloseChangeEmailModal} />
              <Button title="Confirm" onPress={handleConfirmChangeEmail} />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="none"
        transparent={true}
        visible={deleteAccountModalVisible}
        onRequestClose={handleCloseDeleteAccountModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={deleteAccountPassword}
              onChangeText={setDeleteAccountPassword}
              secureTextEntry
            />
            <View style={styles.buttonsContainer}>
              <Button title="Cancel" onPress={handleCloseDeleteAccountModal} />
              <Button title="Confirm" onPress={handleConfirmDeleteAccount} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  item: {
    width: '80%',
    height: 50,
    backgroundColor: '#ddd',
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
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
