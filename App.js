import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Signup from './screens/Signup';
import Signin from './screens/Signin';
import ForgotPassword from './screens/ForgotPassword';
import { initializeApp } from 'firebase/app'; // Import initializeApp function from firebase/app
import firebaseConfig from './firebase/firebaseConfig'; // Import the Firebase configuration object

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Signup">
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Signin" component={Signin} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
