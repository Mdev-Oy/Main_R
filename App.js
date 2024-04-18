import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from "react-native-paper";

import { Login } from "./src/pages/Login";
import { SignUp } from "./src/pages/SignUp";
import { MainS } from "./src/pages/MainS";
import { Settings } from "./src/pages/Settings/Settings";
import { RestorePassword } from "./src/pages/RestorePassword";

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <Provider>
    <NavigationContainer 
    theme={{ colors: { background: '#161618' } }}>
      <Stack.Navigator
      screenOptions={{
        animation: 'ios'
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
    </Provider>
  );
}