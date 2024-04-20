import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import {CountdownCircleTimer, onTimeElapsed} from 'react-native-countdown-circle-timer';
import { TextInput, Button, Paragraph, Dialog, Portal, Divider } from 'react-native-paper';
import { auth, db } from "../../firebase";
import { signOut, signInWithEmailAndPassword, EmailAuthProvider, reauthenticateWithCredential, updateEmail, updatePassword, verifyBeforeUpdateEmail } from "firebase/auth";
import { doc, updateDoc, getDoc, setDoc, Firestore, increment } from 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';


const bgColor = "#161618";

export const FTimer = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [initialDuration, setInitialDuration] = useState(300); 
  const [reset, setReset] = useState(0);
  const now = new Date();
  const user = auth.currentUser;

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
    setReset(reset + 1);

  };

  const handleDone = async () => {
    // Stop the timer
    setIsRunning(false);
    setReset(reset + 1);

    try {
      const focusedTimeMinutes = initialDuration / 60;

      const userStatsRef = doc(db, "users", user.uid, "stats", now.getUTCFullYear() + "-" + ('0' + (now.getUTCMonth() + 1)).slice(-2) + "-" + ('0' + now.getUTCDate()).slice(-2));
      const userStatsDoc = await getDoc(userStatsRef);

      const userDocRef = doc(db, "users", user.uid);
      
      
      await updateDoc(userDocRef, {
        focusedTime: increment(focusedTimeMinutes)
      });

      console.log('total worked')
      if (userStatsDoc.exists()) {
        await updateDoc(userStatsRef, {
          focusedTime: increment(focusedTimeMinutes)
        });
        console.log(1);

      } else {
        await setDoc(userStatsRef, {
          date: now.getTime(),
          focusedTime: focusedTimeMinutes
        },{ merge: true });
        console.log(2);
      }

    } catch (error) {
      console.error("Error updating focused time:", error);
    }
  };



  const handleTimeElapsed = () => {

    console.log('Timer elapsed');
  };

  const handleDurationChange = (text) => {
    const newTime = parseInt(text) * 60;
    if (text) {
      setInitialDuration(newTime)
    } else {
      setInitialDuration(0);
    }

  }

  return (
    <SafeAreaView style = {styles.mainView}>
    <View style = {styles.container}>


      <CountdownCircleTimer
        isPlaying={ isRunning }
        duration={ initialDuration }
        colors="#FFFFFF"
        strokeWidth={8}
        size={250}
        textStyle={{ fontSize: 50 }}
        onTimeElapsed= { handleDone }
        onComplete={handleDone}
        key={reset}
      >

        {({ remainingTime }) => {
            const minutes = Math.floor(remainingTime / 60);
            const seconds = remainingTime % 60;
            const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            
            return isRunning ? (
              <Text style={{ fontSize: 50, color: 'white' }}> {formattedTime} </Text>
            ) : (
              <TextInput
                value={initialDuration > 0 && initialDuration <= 7200 ? (initialDuration / 60).toString() : ('') }
                onChangeText={handleDurationChange}
                keyboardType="numeric"
                mode='flat'
                underlineColor='transparent'
                activeUnderlineColor='transparent'
                textColor='#FFFFFF'
                style={{ textAlign: 'center', backgroundColor: 'transparent', fontSize: 50 }}
              />
            );
          }}
        </CountdownCircleTimer>

      
      {isRunning ? (
          <View style={{  }}>
              <Button 
                mode="text" 
                labelStyle={{fontSize: 50}}
                icon="close-thick" 
                textColor='#FFFFFF'
                rippleColor='transparent'
                onPress={handleStop}> 
              </Button>
              
          </View>
      ) : (
          <View style={{  }}>
              <Button 
                mode="text" 
                labelStyle={{fontSize: 50}}
                icon="play" 
                textColor='#FFFFFF'
                rippleColor='transparent'
                onPress={handleStart}
              />
          
        </View>
      )}
    </View>
  </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }





})