// Signup.js

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '@react-native-firebase/auth';
import AppStyles from '../styles/AppStyles';

const Signup = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = async () => {
    try {
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }
      await auth().createUserWithEmailAndPassword(email, password);
      Alert.alert("Success", "Account created successfully!");
      navigation.navigate('Signin');
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={[AppStyles.container, { backgroundColor: '#add8e6' }]}>
      <Text style={AppStyles.logo}>Signup</Text>
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
      <View style={AppStyles.inputView}>
        <TextInput
          secureTextEntry
          style={AppStyles.inputText}
          placeholder="Confirm Password..."
          placeholderTextColor="#003f5c"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>
      <TouchableOpacity style={AppStyles.btn} onPress={handleSignUp}>
        <Text style={AppStyles.btnText}>REGISTER</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Signin')}>
        <Text style={AppStyles.linkText}>Already have an account? Sign in</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Signup;
