import React, { useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, TextInput, Pressable, Keyboard, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

//import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

import { Screen_button } from "../modules/Screen_button";
export const Login = () => {

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const nav = useNavigation();

  const move_signUp = () => {
    nav.push("SignUp"); // should we changed
  };

  const move_main = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.error("Logged in success")
    } catch (error) {

      console.error(error);
      Alert.alert('Error', error.message);
    }
  };


  // add bouncer
  // css
  // function names?

  return (
    <Pressable style={styles.contentView} onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.contentView}>

        <View style={styles.maincontainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title_main}> Focus </Text>
          </View>
          <View style={styles.mainContent}>


            <Text style = {styles.field_label}> Email </Text>
            <TextInput
              style={styles.input_login}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              inputMode="email"
            />

            <Text style = {styles.field_label}> Password </Text>
            <TextInput
              style={styles.input_login}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

          <Screen_button 
            title="Login" 
            onPress={move_main} 
            type = "primary" 
          />

          <Screen_button
            title="Sign Up"
            onPress={move_signUp}
            type = "secondary"
          />
          </View>
          

        </View>
      </SafeAreaView>
    </Pressable>
  );
};

const styles = StyleSheet.create({

  contentView: {
    flex: 1,
    backgroundColor: "#0F0C36",
  },

  maincontainer: {
    flex: 1,
    padding: '5%' , 
    backgroundColor: "#0F0C36",
  },

  titleContainer: {
    flex: 1.2,
    justifyContent: "center",
  },

  title_main: {
    fontSize: 45,
    textAlign: "center",
    fontWeight: "500",
    color: "#ffffff"
  },

  input_login: {
    borderBottomWidth: 1,
    borderRadius: 10,
    height: "7%",
    fontSize: 15,
    backgroundColor: "white",
    paddingLeft: 8,
  },

  field_label: {
    color: "#ffffff",
    fontWeight: "500",
    marginTop: "8%",
    marginBottom: "2%",
  },

  mainContent: {
    flex: 6,
  },

  
});
