import React, { useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, TextInput, Pressable, Keyboard } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { Screen_button } from "../modules/Screen_button";


export const SignUp = () => {


  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const nav = useNavigation();

  const createUser = async () => {
    try {
      
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
      });

      move_login()
      
    } catch (error) {
      
      console.error(error);
      //Alert.alert('Error', error.message);
    }
  };

  const move_login = () => {
    nav.push("Login")
  }



  return (
    <Pressable style={styles.contentView} onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.contentView}>

        <View style={styles.maincontainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.main_title}> Create an account </Text>
          </View>
          <View style={styles.mainContent}>

            
            <Text style = {styles.field_label}> Email </Text>
            <TextInput
              style = {styles.input_signUp}
              placeholder="Enter your email"
              value = {email}
              onChangeText={setEmail}
              autoCapitalize="none"
              inputMode="email"
            />

            <Text style = {styles.field_label}> Password </Text>
            
            <TextInput
              style = {styles.input_signUp}
              placeholder="Enter your password"
              value = {password}
              onChangeText={setPassword}
              secureTextEntry
            />
          
          
          <Screen_button
            title="Sign Up"
            onPress={createUser}
            type = "primary"
          />


          <Screen_button
            title="Already have an account? Login"
            onPress={nav.goBack}
            type = "secondary"
          />

          <Screen_button
            title="Go back"
            onPress={nav.goBack}
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
    flex: 1.25,
    justifyContent: "center",
  },

  main_title: {
    fontSize: 45,
    textAlign: "center",
    fontWeight: "300",
    color: "#ffffff"
  },

  input_signUp: {
    borderBottomWidth: 1,
    borderRadius: 10,
    height: "7%",
    fontSize: 15,
    paddingLeft: 8,
    backgroundColor: "#ffffff"
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
