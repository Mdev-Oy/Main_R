import React, { useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, TextInput, Pressable, Keyboard, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";



import { Settings } from "./Settings/Settings";
import { FTimer } from "./Timer";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';



const Tab = createBottomTabNavigator();
const bgColor = "#161618";

export const BottomNav = () => {


    const nav = useNavigation();

    const move_settings = () => {
      nav.push("Settings"); 
    };
  
    return (
    <Tab.Navigator    
    screenOptions={{
      tabBarStyle: {
        backgroundColor: '#1a1a1c', 
        borderTopWidth: 0,
        height: '7.5%',
      },
      tabBarShowLabel: false,
      tabBarActiveTintColor: '#FFFFFF',
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
  
  const styles = StyleSheet.create({

  });