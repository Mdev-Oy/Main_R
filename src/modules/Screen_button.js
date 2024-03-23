import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export const Screen_button = ({ title, onPress, type }) => {
  const containerStyle =
  
    type === "primary" ? styles.containerPrimary : styles.containerSecondary;

  const textStyle =
    type === "primary" ? styles.textPrimary : styles.textSecondary;

  return (
    <TouchableOpacity onPress = {onPress} style = {containerStyle}>
      <Text style={textStyle}> {title} </Text>
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
    
  containerPrimary: {
    height: "7%",
    backgroundColor: "white",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "15%",
    marginBottom: "2.5%"
  },

  containerSecondary: {
    justifyContent: "center",
    alignItems: "center",

  },

  textPrimary: {
    fontSize: 15,
    fontWeight: "bold",
    color: "black",
  },

  textSecondary: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#ffffff",
  },
});
