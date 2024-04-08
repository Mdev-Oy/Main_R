import React, { useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, TextInput, Pressable, Keyboard, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';



export const MainS = () => {
    const [isPlaying, setIsPlaying] = React.useState(true)
    const [duration, setDuration] = useState(10);
  
    return (
      <View style={styles.container}>
        <CountdownCircleTimer
          isPlaying={isPlaying}
          duration={duration}
          colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
          colorsTime={[10, 6, 3, 0]}
          onComplete={() => ({ shouldRepeat: true, delay: 2 })}
          updateInterval={1}
      >
        {({ remainingTime, color }) => (
          <Text style={{ color, fontSize: 40 }}>
            {remainingTime}
          </Text>
        )}
      </CountdownCircleTimer>
      <Button title="|| or >" onPress={() => setIsPlaying(prev => !prev)} /> 
      <TextInput
          style={styles.input}
          placeholder="Set Time (seconds)"
          keyboardType="numeric"
          onChangeText={text => setDuration(parseInt(text) || 0)} // Ensure input is parsed to integer
        />
    </View>
    )
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ecf0f1',
      padding: 8,
    }
  });