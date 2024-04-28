import React, { useState } from "react";
import { SafeAreaView, View, StyleSheet, Pressable, Keyboard, TouchableOpacity, StatusBar, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TextInput, Button, Paragraph, Dialog, Portal, Checkbox, useTheme, Text } from 'react-native-paper';


import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";







export const SignUp = () => {

  const theme = useTheme();
  const [email, setEmail] = useState();
  const [IsEmailValid, setIsEmailValid] = useState(false);
  const [IsPasswordValid, setIsPasswordValid] = useState(false);
  const [IsPasswordVisible, setIsPasswordVisible] = useState(false);
  const [password, setPassword] = useState();
  const [agreed, setAgreed] = useState(false);

  const [visible, setVisible] = useState(false);
  const hideDialog = () => setVisible(false);

  const [visibleTerms, setVisibleTerms] = useState(false);
  const hideTerms = () => setVisibleTerms(false);


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
        longestSession: 0,
        signedUp: now.getTime(),
        icon: 'turtle',
        deleteRequest: false,
        stats: [], 
        achievements: [
          { name: "Beginer", icon: "clock-time-six-outline", description: "Reach 1 hour of total focused time", completed: false },
          { name: "Focused Apprentice", icon: "star-four-points", description: "Reach 5 hours of total focused time", completed: false }, 
          { name: "Time Master", icon: "trophy-variant-outline", description: "Reach 10 hours of total focused time", completed: false },
          { name: "Focus Guru", icon: "head-lightbulb-outline", description: "Reach 25 hours of total focused time", completed: false },
          { name: "Marathon", icon: "fast-forward-30", description: "Complete a single focus session >= 30 minutes", completed: false },
          { name: "Marathon II", icon: "fast-forward-60", description: "Complete a single focus session >= 60 minutes", completed: false }
        ], 
      });

      const statsRef = doc(db, "users", user.uid, "stats", now.getUTCFullYear() + "-" + ('0' + (now.getUTCMonth() + 1)).slice(-2) + "-" + ('0' + now.getUTCDate()).slice(-2));

      await setDoc(statsRef, {
      date: now.getTime(), 
      focusedTime: 0
      });

      
      setTimeout(move_login, 1000) // needs to be changed
      
    } catch (error) {
      setVisible(true);
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
    <Pressable style={{flex: 1, backgroundColor: theme.colors.background,}} onPress={Keyboard.dismiss}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background}/>
      <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.background,}}>
      <Portal> 
          <Dialog visible={visible} onDismiss={hideDialog} style={{ backgroundColor: theme.colors.onPrimary }}>
            <Dialog.Title style = {{color: theme.colors.secondary}}> Sign Up failed </Dialog.Title>
            <Dialog.Content>
              <Paragraph style = {{color: theme.colors.outline}}> Please try again </Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog} textColor={theme.colors.secondary}> Ok </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        <View style={{flex: 1, padding: '10%', backgroundColor: theme.colors.background,}}>
          <View style={styles.titleContainer}>
            <Text style={styles.title_main}> Create an account </Text>
          </View>
          <View style={styles.mainContent}>

            
          <Text style = {styles.field_label}> Email </Text>
                    <TextInput
                      style={styles.input_signup}

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
                      theme = {{ colors: { background: 'white' } }}
                    />
        
                    <Text style = {styles.field_label}> Password </Text>
                    <TextInput
                      style={styles.input_signup}

                      mode='outlined'
                      textColor={theme.colors.onSurfaceVariant}
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
                      theme = {{ colors: { background: theme.colors.onPrimary } }}
                    />

        <View style = {{flexDirection: 'row', marginTop: '3%'}}>
        <Checkbox
          rippleColor={'transparent'}
          status={agreed ? 'checked' : 'unchecked'}
          onPress={() => {
            setAgreed(!agreed);
          }}
          color={theme.colors.onPrimary}
          uncheckedColor={theme.colors.onPrimary}
        /> 
      <TouchableOpacity style = {{alignSelf: 'center'}} onPress={() => setVisibleTerms(true)}>
        <Text style = {{color: theme.colors.onPrimary, textDecorationLine: 'underline'}}>I agree with terms and conditions</Text>
      </TouchableOpacity>
      
      <Portal> 
          <Dialog visible={visibleTerms} onDismiss={hideTerms} style={{ backgroundColor: theme.colors.onPrimary, borderRadius: 10 }}>
          <Dialog.Title style = {{color: theme.colors.secondary}}> Terms and Conditions </Dialog.Title>
            <Dialog.ScrollArea>
            <ScrollView>

            <Dialog.Content>
              <Paragraph style = {{color: theme.colors.primary, fontWeight: 'bold', paddingTop: 15}}>I. Using Galaxy </Paragraph>

                <Text style = {{color: theme.colors.secondary}}>- You may use Galaxy to help you focus on your tasks. </Text>
                <Text style = {{color: theme.colors.secondary}}>- You agree to use Galaxy responsibly and not for any illegal or harmful purposes. </Text>

              <Paragraph style = {{color: theme.colors.primary, fontWeight: 'bold', paddingTop: 15}}>II. Data We Collect</Paragraph>
                <Text style = {{color: theme.colors.secondary}}>- To improve Galaxy, we collect limited data about your usage, such as how long you use the focus features. </Text>

              <Paragraph style = {{color: theme.colors.primary, fontWeight: 'bold', paddingTop: 15}}>III. Your Privacy Rights </Paragraph>
                <Text style = {{color: theme.colors.secondary}}>- We comply with the General Data Protection Regulation (GDPR). </Text>
                <Text style = {{color: theme.colors.secondary}}>- You have the right to request a copy of your data. </Text>
                <Text style = {{color: theme.colors.secondary}}>- You can request that we delete your data at any time.</Text>

              <Paragraph style = {{color: theme.colors.primary, fontWeight: 'bold', paddingTop: 15}}>IV. Data We Collect</Paragraph>
                <Text style = {{color: theme.colors.secondary}}>- Galaxy is provided "as is." We make no guarantees about its performance or that it will always be available. </Text>

              <Paragraph style = {{color: theme.colors.primary, fontWeight: 'bold', paddingTop: 15}}>V. Contact Us</Paragraph>
                <Text style = {{color: theme.colors.secondary}}>- We may update these terms occasionally. We'll notify you of significant changes. </Text>
                <Text style = {{color: theme.colors.secondary}}>- If you have questions / want to request your data, send an email to: galaxy@gmail.com</Text>
              
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideTerms} textColor={theme.colors.secondary}> Ok </Button>
            </Dialog.Actions>
            </ScrollView>
            </Dialog.ScrollArea>
          </Dialog>
        </Portal>



        </View>
          
          </View>

          <View style={styles.bottom_buttons}>
          <Button 
                    mode="contained" 
                    
                    disabled={(agreed && IsPasswordValid && IsEmailValid) ? false : true}
                    onPress={createUser} 
                    buttonColor={theme.colors.onPrimary}
                    textColor={theme.colors.primary}
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
    </Pressable>
  );
};

const styles = StyleSheet.create({



  titleContainer: {
    justifyContent: "center",
  },

  mainContent: {
    flex: 1,
    marginTop: '5%',
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
    marginTop: "5%",
    marginBottom: "3%",
  },

  bottom_buttons: {
  },

  signup_button: {
    textColor: "#818181",
    borderRadius: 10,
    marginBottom: "2%"
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
