// Signin.js

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '@react-native-firebase/auth';
import AppStyles from '../styles/AppStyles';

const Signin = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
      // If login successful, you may navigate to another screen
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={[AppStyles.container, { backgroundColor: '#add8e6' }]}>
      <Text style={AppStyles.logo}>Sign in</Text>
      <View style={AppStyles.inputView}>
        <TextInput
          style={AppStyles.inputText}
          placeholder="Email..."
          placeholderTextColor="#003f5c"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={AppStyles.inputView}>
        <TextInput
          secureTextEntry
          style={AppStyles.inputText}
          placeholder="Password..."
          placeholderTextColor="#003f5c"
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <TouchableOpacity style={AppStyles.btn} onPress={handleSignIn}>
        <Text style={AppStyles.btnText}>LOGIN</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={AppStyles.linkText}>Forgot your password?</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Signin;
