import {Text, StyleSheet, Pressable} from 'react-native';
import React from 'react';

export default function CustomButton(props) {
  const {title, onPress, color} = props;
  const myButton = () => {
    return {
      marginTop: 10,
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 4,
      elevation: 3,
      backgroundColor: color,
    };
  };
  return (
    <Pressable style={myButton} onPress={onPress}>
      <Text style={styles.textInButton}>{title} </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  textInButton: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    lineHeight: 21,
  },
});
