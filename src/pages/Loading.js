import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import { useTheme } from 'react-native-paper';


export const Loading = () => {
  const theme = useTheme();

  <View style={[styles.container, styles.horizontal]}>
    <ActivityIndicator size="large" color={theme.colors.onPrimary} />
  </View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  }
});

