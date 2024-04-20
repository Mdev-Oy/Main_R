import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, StyleSheet, Pressable, TouchableOpacity, Keyboard } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TextInput, Button, Paragraph, Dialog, Portal } from 'react-native-paper';

import { auth } from "../../firebase";
import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";

import { Loading } from "./Loading";


const bgColor = "#161618";

export const RestorePassword = () => {

    const nav = useNavigation();
    const hideDialog = () => setVisible(false);
    const [email, setEmail] = useState('');
    const [IsEmailValid, setIsEmailValid] = useState(false);
    const [visible, setVisible] = useState(false);


    const validateEmail = (email) => {
        const isValid =  /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(email);
        setIsEmailValid(isValid); 
      };

      const handlePasswordReset = async () => {
        try {
            await sendPasswordResetEmail(auth, email);
            setEmail('');
            
      
            nav.navigate("Login");
      
          } catch (error) {
                console.log(error);
            } 
        
            finally {
                setVisible(true);
            }
        }
        

    return (
        

          <SafeAreaView style={styles.contentView}>

            <Portal> 
                <Dialog visible={visible} onDismiss={hideDialog} style={{ backgroundColor: '#FFFFFF' }}>
                    <Dialog.Title> Email sent! </Dialog.Title>
                    <Dialog.Content>
                        <Paragraph> We've sent you an email! Please check your inbox </Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={hideDialog} textColor="#000000"> Ok </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>




            <View style={styles.maincontainer}>
              <View style={styles.titleContainer}>
                <Text style={styles.title_main}> Reset your Password </Text>
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
            
              
              </View>
    
              <View style = {styles.bottom_buttons}>
                <Button 
                        mode="contained" 
                        onPress={handlePasswordReset} 
                        buttonColor="#FFFFFF"
                        textColor={bgColor}
                        rippleColor="#bababa"
                        style = {styles.restore_button}>
                          
                        
                        Reset Password
                      
                </Button>

                <TouchableOpacity onPress={nav.goBack}>
                    <Text style={styles.goBack_button}> Go Back </Text>
                  </TouchableOpacity>
    
    
            </View>
            </View>
          </SafeAreaView>
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

    bottom_buttons: {

    },
  
  
    restore_button: {
      textColor: "#818181",
      borderRadius: 10,
      marginBottom: "3%"
    },
  
    goBack_button: {
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