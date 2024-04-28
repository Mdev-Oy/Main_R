import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {
  MD3LightTheme,
  MD3DarkTheme,
  PaperProvider,
} from 'react-native-paper';


import { Login } from "./src/pages/Login";
import { SignUp } from "./src/pages/SignUp";
import { MainS } from "./src/pages/MainS";
import { Settings } from "./src/pages/Settings/Settings";
import { RestorePassword } from "./src/pages/RestorePassword";





export default function App() {
  const Stack = createNativeStackNavigator();
  const theme = {
    ...MD3DarkTheme, 
    roundness: 5,
    colors: {
      ...MD3DarkTheme.colors,
      primary: '#161618',
      onPrimary: '#ffffff',
      secondary: '#202022',
      secondaryContainer: '#1a1a1c',
      onSecondary: '#1a1a1c',
      tertiary: '#1a1a1c',
      background: '#161618',
      outline: '#5d5d5f',
      onSurfaceVariant: "#5d5d5f", // icons etc.
    },
  };
  


  return (
    <PaperProvider theme={theme}>
    <NavigationContainer 
    theme={{ colors: { background: theme.colors.background, secondaryContainer: 'rgba(255, 255, 255, 0.1)'} }}>
      <Stack.Navigator
      screenOptions={{
        animation: 'ios',
        navigationBarColor: theme.colors.tertiary,
        navigationBarHidden: true
      }}
      >

        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false,
          }}
        />
        
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{
            headerShown: false,
          }}
        />


        <Stack.Screen
          name="RestorePassword"
          component={RestorePassword}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="MainS"
          component={MainS}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{
            headerShown: false,
          }}
        />


      </Stack.Navigator>
    </NavigationContainer>
    </PaperProvider>
  );
}