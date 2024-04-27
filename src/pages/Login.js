import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, StyleSheet, Pressable, TouchableOpacity, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TextInput, Button, Paragraph, Dialog, Portal, useTheme } from 'react-native-paper';

import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

import { Loading } from "./Loading";


const bgColor = "#161618";

export const Login = () => {

  const theme = useTheme();

  const [email, setEmail] = useState('');
  const [IsEmailValid, setIsEmailValid] = useState(false);
  const [password, setPassword] = useState('');
  const [IsPasswordValid, setIsPasswordValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 

  const [visible, setVisible] = useState(false);
  const hideDialog = () => setVisible(false);
  const [ErrorMsg, setErrorMsg] = useState('');


  const validateEmail = (email) => {
    const isValid =  /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(email);
    setIsEmailValid(isValid); 
  };

  const validatePassword = (password) => {
    setIsPasswordValid(password.length >= 8);
  };

  const nav = useNavigation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        nav.navigate("MainS");
      } else {
        setIsLoading(false);
      }
    });

    return unsubscribe; 
  }, []);

  const move_signUp = () => {
    nav.push("SignUp"); 
  };
  

  const move_main = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoading(true);

      nav.navigate("MainS");

    } catch (error) {
      setVisible(true);
      const errorCode = error.code;

      switch (errorCode) {
        
        case 'auth/invalid-email':
          setErrorMsg("Icorrect Email or Password. Please try again.");
          break;
        
        case 'auth/wrong-password':
          setErrorMsg("Icorrect Email or Password. Please try again.");
          break;

        case 'auth/user-not-found':
          setErrorMsg("User not found. Please try again");
          break;

        case 'auth/missing-email':
          setErrorMsg("Please enter a valid email");
          break;
        
        case 'auth/missing-password':
          setErrorMsg("Please enter a valid email and password");
          break;
        
        default:
          setErrorMsg("Authentication failed, please try again later");
          break;
      } 
    } finally {
      setIsLoading(false);
      setEmail('');
      setPassword('');
      setIsEmailValid(false);
      setIsPasswordValid(false);
    }
  };



  return (

      <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.primary}}>
        <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
        <Portal> 
          <Dialog visible={visible} onDismiss={hideDialog} style={{ backgroundColor: theme.colors.onPrimary }}>
            <Dialog.Title style = {{color: theme.colors.secondary}}> Login failed </Dialog.Title>
            <Dialog.Content>
              <Paragraph style = {{color: theme.colors.outline}}> {ErrorMsg}</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog} textColor={theme.colors.secondary}> Ok </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        { isLoading ? (<Loading/>
        ) : (
                  <View style={{flex: 1, padding: '10%' , backgroundColor: theme.colors.background,}}>

                  <View style={styles.titleContainer}>
                    <Text style={{fontSize: 45, textAlign: "center", fontWeight: "500", color: theme.colors.onPrimary}}> Galaxy </Text>
                  </View>
                  
                  <View style={styles.mainContent}>
                    <Text 
                      style = {{
                        color: theme.colors.onPrimary,
                        fontWeight: "500",
                        marginTop: "8%",
                        marginBottom: "3%",
                    }}> 
                      Email 
                    </Text>

                    <TextInput
                      style={styles.input_login}
                      mode='outlined'
                      textColor={theme.colors.onSurfaceVariant}
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
                      theme = {{ colors: { background: theme.colors.onPrimary } }}
                    />
        
                    <Text style = {styles.field_label}> Password </Text>
                    <TextInput
                      style={styles.input_login}

                      mode='outlined'
                      textColor={theme.colors.onSurfaceVariant}
                      placeholder="Enter your password"
                      value={password}
                      onChangeText={(password) => {setPassword(password); validatePassword(password); }} 
                      secureTextEntry
                      activeOutlineColor={theme.colors.outline}
                      right={IsPasswordValid ? (
                        <TextInput.Icon icon="check-bold"/>
                      ) : (
                        <TextInput.Icon icon="lock" />
                      )}
                      outlineStyle = {{borderRadius: 5}}
                      theme = {{ colors: { background: theme.colors.onPrimary } }}
                    />




                  <TouchableOpacity onPress={() => nav.push("RestorePassword")}>
                    <Text style={styles.forgotPassword_button}>Forgot Password?</Text>
                  </TouchableOpacity>
                  </View>

                  <View style = {styles.bottom_buttons}>
                  <Button 
                    mode="contained" 
                    
                    onPress={move_main} 
                    disabled={(IsEmailValid && IsPasswordValid) ? false : true}
                    buttonColor={theme.colors.onPrimary}
                    textColor={theme.colors.primary}
                    rippleColor="#bababa"
                    style = {styles.login_button}>
                      
                    
                    Login
                  
                  </Button>

                  <TouchableOpacity onPress={move_signUp}>
                    <Text style={styles.signUp_button}> Sign Up </Text>
                  </TouchableOpacity>

                  </View>
                </View>
        )}


      </SafeAreaView>
  );
};

const styles = StyleSheet.create({


  titleContainer: {
    justifyContent: "center",
  },

  mainContent: {
    flex: 1,
    marginTop: '10%',
  },


  field_label: {
    color: "#ffffff",
    fontWeight: "500",
    marginTop: "8%",
    marginBottom: "3%",
  },

  bottom_buttons: {

  },

  forgotPassword_button: {
    alignSelf: 'flex-end', 
    marginTop: "3%",
    color: "#FFFFFF",
    fontWeight: "bold"
  },

  login_button: {
    textColor: "#818181",
    borderRadius: 10,
    marginBottom: "2%"
  },

  signUp_button: {
    alignSelf: "center",
    marginTop: "3%",
    color: "#FFFFFF",
    fontWeight: "bold"
  }

  
});
