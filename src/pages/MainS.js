import React, { useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, TextInput, Pressable, Keyboard, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';


import { FTimer } from "./Timer";
import { Screen_button } from "../modules/Screen_button";



const bgColor = "#161618";

export const MainS = () => {
    const [isPlaying, setIsPlaying] = React.useState(true)
    const [duration, setDuration] = useState(10);

    const nav = useNavigation();

    const move_settings = () => {
      nav.push("Settings"); 
    };
  
    return (
      <View style={styles.container}>

          <Screen_button
            title="Settings"
            onPress={move_settings}
            type = "primary"
          />


          <FTimer/>
    </View>
    )
  }
  
  const styles = StyleSheet.create({

    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',

    }
  });