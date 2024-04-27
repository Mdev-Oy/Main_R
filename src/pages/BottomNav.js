import React, { useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, TextInput, Pressable, Keyboard, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme } from "react-native-paper";


import { Settings } from "./Settings/Settings";
import { FTimer } from "./Timer";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';



const Tab = createBottomTabNavigator();

export const BottomNav = () => {


    const nav = useNavigation();
    const theme = useTheme();

    const move_settings = () => {
      nav.push("Settings"); 
    };
  
    return (
    <Tab.Navigator    
    screenOptions={{
      tabBarStyle: {
        backgroundColor: theme.colors.tertiary, 
        borderTopWidth: 0,
        height: '7.5%',
      },
      tabBarShowLabel: false,
      tabBarActiveTintColor: theme.colors.onPrimary,
      tabBarInactiveTintColor: '#fcfcfc',
    }}>

      <Tab.Screen
        name="Stats"
        component={FTimer}
        options={{
          headerShown: false,
          tabBarLabel: 'Home', 
          tabBarIcon: ({focused, color, size}) => {
            return <Icon name={focused ? "chart-timeline-variant" : "chart-line-variant"} size={30} color={color} focused={focused}/>
          }
        }}
      />
      
      <Tab.Screen
        name="Home"
        component={FTimer}
        options={{
          headerShown: false,
          tabBarLabel: 'Home', 
          tabBarIcon: ({focused, color, size}) => {
            return <Icon name={focused ? "home" : "home-outline"} size={30} color={color} focused={focused}/>
          }
        }}
      />

      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          headerShown: false,
          tabBarLabel: 'Settings', 
          tabBarIcon: ({focused, color, size}) => {
            return <Icon name={focused ? "cog" : "cog-outline"} size={25} color={color} focused={focused}/>
          }

        }}
      />
    </Tab.Navigator>
    )
  }
  