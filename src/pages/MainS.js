import React, { useState } from "react";
import { StyleSheet, } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "react-native-paper";


import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
;



import { Settings } from "./Settings/Settings";
import { FTimer } from "./Timer";
import { Stats } from "./Stats";
 


const Tab = createMaterialBottomTabNavigator();


export const MainS = () => {

    const theme = useTheme();



  
    return (
    <Tab.Navigator
    initialRouteName="Home"
    activeColor='#FFFFFF'
    inactiveColor='#fcfcfc'

    barStyle={{
      backgroundColor: theme.colors.secondaryContainer,
    }}
    >

      <Tab.Screen
        name="Stats"
        component={Stats}
        options={{
          headerShown: false,
          tabBarLabel: 'Stats', 
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