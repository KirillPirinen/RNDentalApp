import React from 'react'
import { StyleSheet, TouchableOpacity, Text } from 'react-native'

const Button = ({ children, color, onPress, textColor }) => (
  <TouchableOpacity style={[styles.wrapper, { backgroundColor: color }]} onPress={onPress} color={color}>
    <Text style={[styles.text, { color: textColor }]}>{children}</Text>
  </TouchableOpacity>
)

Button.defaultProps = {
  color: '#27A2DF',
  textColor: '#FFFFFF'
}

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    height: 45
  },
  text: {
    fontWeight: '400',
    fontSize: 16
  }
})

export default Button
