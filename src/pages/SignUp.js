import React, { useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, Pressable, Keyboard, TouchableOpacity, StatusBar } from "react-native";
import { TextInput, Button, Paragraph, Dialog, Portal } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";

import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { Screen_button } from "../modules/Screen_button";
import Toast from 'react-native-toast-message';



const bgColor = "#161618";

export const SignUp = () => {


  const [email, setEmail] = useState();
  const [IsEmailValid, setIsEmailValid] = useState(false);
  const [IsPasswordValid, setIsPasswordValid] = useState(false);
  const [IsPasswordVisible, setIsPasswordVisible] = useState(false);
  const [password, setPassword] = useState();

  const nav = useNavigation();



  const createUser = async () => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      const now = new Date();

      await setDoc(doc(db, "users", user.uid), {
        userID: user.uid, 
        username: user.uid,  
        email: user.email,
        focusedTime: 0, 
        stats: [], 
      });

      const statsRef = doc(db, "users", user.uid, "stats", now.getUTCFullYear() + "-" + ('0' + (now.getUTCMonth() + 1)).slice(-2) + "-" + ('0' + now.getUTCDate()).slice(-2));

      await setDoc(statsRef, {
      date: now.getTime(), 
      focusedTime: 0
      });

      Toast.show({
        type: 'success',
        text1: 'Registered!',
        visibilityTime: 700,
        autoHide: true,
      })


      setTimeout(move_login, 1000) // needs to be changed
      
    } catch (error) {
      
      Toast.show({
        type: 'error',
        text1: 'Error, please try again!',
        visibilityTime: 1000,
        autoHide: true,
      })
      
      console.error(error);
      //Alert.alert('Error', error.message);
    }
  };

  const move_login = () => {
    nav.push("Login")
  }

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!IsPasswordVisible);
  }

  const validateEmail = (email) => {
    const isValid =  /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(email);
    setIsEmailValid(isValid); 
  };

  const validatePassword = (password) => {
    setIsPasswordValid(password.length >= 8);
  };



  return (
    <Pressable style={styles.contentView} onPress={Keyboard.dismiss}>
      <StatusBar barStyle="light-content" backgroundColor={bgColor} />
      <SafeAreaView style={styles.contentView}>

        <View style={styles.maincontainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title_main}> Create an account </Text>
          </View>
          <View style={styles.mainContent}>

            
          <Text style = {styles.field_label}> Email </Text>
                    <TextInput
                      style={styles.input_signup}

                      mode='outlined'
                      placeholder="Enter your email"
                      value={email}
                      onChangeText={(email) => { setEmail(email); validateEmail(email); }} 
                      autoCapitalize="none"
                      inputMode="email"
                      activeOutlineColor="#818181"
                      right={IsEmailValid ? (
                        <TextInput.Icon icon="check-bold"/>
                      ) : (
                        <TextInput.Icon icon="email" />
                      )}
                      outlineStyle = {{borderRadius: 5}}
                      theme = {{ colors: { background: 'white' } }}
                    />
        
                    <Text style = {styles.field_label}> Password </Text>
                    <TextInput
                      style={styles.input_signup}

                      mode='outlined'
                      placeholder="Enter your password"
                      value={password}
                      onChangeText={(password) => {setPassword(password); validatePassword(password); }} 
                      secureTextEntry={!IsPasswordVisible}
                      activeOutlineColor="#818181"
                      right={IsPasswordValid ? (
                        <TextInput.Icon icon="check-bold"/>
                      ) : (
                        <TextInput.Icon 
                        icon= {IsPasswordVisible ? 'eye-off' : 'eye'}
                        onPress={togglePasswordVisibility} />
                      )}
                      outlineStyle = {{borderRadius: 5}}
                      theme = {{ colors: { background: 'white' } }}
                    />
          
          </View>

          <View>
          <Button 
                    mode="contained" 
                    
                    onPress={createUser} 
                    buttonColor="#FFFFFF"
                    textColor={bgColor}
                    rippleColor="#bababa"
                    style = {styles.signup_button}>
                      
                    
                    Sign Up
                  
                  </Button>


                  <TouchableOpacity onPress={move_login}>
                    <Text style={styles.login_button}> Already have an account? Login </Text>
                  </TouchableOpacity>


        </View>
        </View>
      </SafeAreaView>
      <Toast />
    </Pressable>
  );
};

const styles = StyleSheet.create({


  contentView: {
    flex: 1,
    backgroundColor: bgColor,
  },

  maincontainer: {
    flex: 1,
    padding: '10%' , 
    backgroundColor: bgColor,


  },

  titleContainer: {
    justifyContent: "center",
  },

  mainContent: {
    flex: 1,
    marginTop: '10%',
  },

  title_main: {
    fontSize: 45,
    textAlign: "center",
    fontWeight: "500",
    color: "#ffffff"
  },


  field_label: {
    color: "#ffffff",
    fontWeight: "500",
    marginTop: "8%",
    marginBottom: "3%",
  },


  signup_button: {
    textColor: "#818181",
    borderRadius: 10,
    marginBottom: "3%"
  },

  login_button: {
    alignSelf: "center",
    marginTop: "3%",
    color: "#FFFFFF",
    fontWeight: "bold"
  },

  forgotPassword_button: {
    alignSelf: 'flex-end', 
    marginTop: "3%",
    color: "#FFFFFF",
    fontWeight: "bold"
  },

  
});
