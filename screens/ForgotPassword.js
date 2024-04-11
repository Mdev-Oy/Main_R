// ForgotPassword.js

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import AppStyles from '../styles/AppStyles';
import { auth } from '@react-native-firebase/auth';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const sendPasswordResetEmail = async () => {
    try {
      await auth().sendPasswordResetEmail(email);
      Alert.alert('Password Reset Email Sent', 'Check your email for instructions to reset your password.');
    } catch (error) {
      console.error('Error sending password reset email:', error);
      Alert.alert('Error', 'Failed to send password reset email. Please try again later.');
    }
  };

  return (
    <View style={[AppStyles.container, { backgroundColor: '#add8e6' }]}>
      <Text style={AppStyles.logo}>Forgot Password</Text>
      <View style={AppStyles.inputView}>
        <TextInput
          style={AppStyles.inputText}
          placeholder="Email..."
          placeholderTextColor="#003f5c"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <Text style={AppStyles.infoText}>We will send you a password reset link to your email</Text>
      <TouchableOpacity style={AppStyles.btn} onPress={sendPasswordResetEmail}>
        <Text style={AppStyles.btnText}>SEND RESET EMAIL</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPassword;
