import React from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Colors } from '../constants/Colors';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
}

export default function Button({ title, style, ...props }: ButtonProps) {
  return (
    <TouchableOpacity style={[styles.button, style]} {...props}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    height: 55,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
    elevation: 2,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  text: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});