import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Checkbox, Text, TouchableRipple } from 'react-native-paper';

export const TouchableCheckbox = ({ label, value, onPress }) => {
  const [_checked, setChecked] = useState(value)
  return (
    <TouchableRipple onPress={() => {
      const newValue = !_checked
      setChecked(newValue)
      onPress(newValue)
    }} style={styles.wrapper}>
      <>
        <Text style={styles.label}>{label}</Text>
        <Checkbox status={_checked ? 'checked' : 'unchecked'} />
      </>
    </TouchableRipple>
  )
}

const styles = StyleSheet.create({
  wrapper: { 
    flex: 1, 
    flexDirection:'row',
    justifyContent: 'space-between',
    alignItems:"center", 
    padding: 10
  },
  label: { fontSize: 16 }
})