import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput, Button, Dialog, Portal, RadioButton, useTheme, IconButton } from 'react-native-paper';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { CountdownCircleTimer, onTimeElapsed } from 'react-native-countdown-circle-timer';

import { auth, db } from "../../firebase";
import { doc, updateDoc, getDoc, setDoc, Firestore, increment } from 'firebase/firestore';



export const FTimer = () => {
  const theme = useTheme();


  const [isRunning, setIsRunning] = useState(false);
  const [initialDuration, setInitialDuration] = useState(300); 
  const [longestSession, setLongestSession] = useState(0);
  const [reset, setReset] = useState(0);
  const [visible, setVisible] = useState(false);
  const [circleColor, setCircleColor] = useState('#ffffff');
  const hideCustomization = () => setVisible(false);


  const now = new Date();
  const user = auth.currentUser;

  useEffect(() => {
    const loadCircleColor = async() => {
      try {
        const clr = await AsyncStorage.getItem('circleColor');
        if (clr) {
          setCircleColor(clr);
        } 
      } catch (error) {}
    };

    loadCircleColor();
  }, []);


  useEffect(() => {
    const setCircleColor = async() => {
      try {
        await AsyncStorage.setItem('circleColor', circleColor);
      } catch (error) {}
    };

    setCircleColor();
  }, [circleColor]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
    setReset(reset + 1);

  };


  useEffect(() => {
    const getLongestSession = async () => {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        setLongestSession(data.longestSession || 0);
        console.log(longestSession);
      }
    }
    getLongestSession();
  }, []); 


  const handleDone = async () => {

    setIsRunning(false);
    setReset(reset + 1);

    try {
      const focusedTimeMinutes = initialDuration / 60;

      const userStatsRef = doc(db, "users", user.uid, "stats", now.getUTCFullYear() + "-" + ('0' + (now.getUTCMonth() + 1)).slice(-2) + "-" + ('0' + now.getUTCDate()).slice(-2));
      const userStatsDoc = await getDoc(userStatsRef);

      const userDocRef = doc(db, "users", user.uid);
      
      
      await updateDoc(userDocRef, {
        focusedTime: increment(focusedTimeMinutes),
      });

      if (focusedTimeMinutes > longestSession) {
        setLongestSession(focusedTimeMinutes);
  
        await updateDoc(userDocRef, {
          longestSession: focusedTimeMinutes
        });
      }


      if (userStatsDoc.exists()) {
        await updateDoc(userStatsRef, {
          focusedTime: increment(focusedTimeMinutes)
        });


      } else {
        await setDoc(userStatsRef, {
          date: now.getTime(),
          focusedTime: focusedTimeMinutes
        },{ merge: true });

      }

    } catch (error) {
    }
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
      <Button
      icon="progress-pencil" 
      textColor='#FFFFFF'
      labelStyle={{fontSize: 35}}
      size={30}
      rippleColor='transparent'
      onPress={() => {setVisible(true)}}
      />
    <View style = {styles.container}>

    <Portal> 
          <Dialog visible={visible} onDismiss={hideCustomization} style={{ backgroundColor: theme.colors.tertiary }}>
            <Dialog.Title style = {{color: theme.colors.onPrimary}}> Customization </Dialog.Title>
            <Dialog.Content>
            <RadioButton.Group onValueChange={val => setCircleColor(val)} value={circleColor}>

              <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                <RadioButton value="#FFFFFF" color='#FFFFFF'/>
                <Text style = {{color: theme.colors.onPrimary}}>White</Text>
              </View>

              <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                <RadioButton value="#A3D8FF" color='#A3D8FF'/>
                <Text style = {{color: theme.colors.onPrimary}}>Blue</Text>
              </View>
              
              <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                <RadioButton value="#94FFD8" color='#94FFD8'/>
                <Text style = {{color: theme.colors.onPrimary}}>Light Green</Text>
              </View>

              <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                <RadioButton value="#FFEBB2" color='#FFEBB2'/>
                <Text style = {{color: theme.colors.onPrimary}}>Yellow</Text>
              </View>
              
              <View style = {{flexDirection: 'row', alignItems: 'center'}}>                            
                <RadioButton value="#FF76CE" color='#FF76CE'/>
                <Text style = {{color: theme.colors.onPrimary}}>Magenta</Text>
              </View>



    </RadioButton.Group>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideCustomization} textColor={theme.colors.onPrimary}> Ok </Button>
            </Dialog.Actions>
          </Dialog>
      </Portal>


      <CountdownCircleTimer
        isPlaying={ isRunning }
        duration={ initialDuration }
        colors={circleColor}
        strokeWidth={8}
        size={250}
        textStyle={{ fontSize: 50 }}
        onTimeElapsed= { handleDone }
        onComplete={ handleDone }
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