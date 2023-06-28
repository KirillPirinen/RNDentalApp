import { FC, ReactNode } from 'react'
import { StyleSheet, TouchableOpacity, Text } from 'react-native'

type ButtonProps = {
  children: ReactNode
  color: string
  onPress: () => void
  textColor: string
}

const Button: FC<ButtonProps> = ({ children, onPress, color = '#27A2DF', textColor = '#FFFFFF' }) => (
  <TouchableOpacity style={[styles.wrapper, { backgroundColor: color }]} onPress={onPress}>
    <Text style={[styles.text, { color: textColor }]}>{children}</Text>
  </TouchableOpacity>
)


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
