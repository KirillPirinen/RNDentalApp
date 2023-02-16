import { useState } from 'react'
import { StyleSheet } from 'react-native'
import { List } from 'react-native-paper'

export const SettingsCheckbox = ({ onChange, style, name, initial, ...rest }) => {
  const [_checked, setChecked] = useState(initial)
  return (
    <List.Item 
      onPress={() => {
        const newValue = !_checked
        setChecked(newValue)
        onChange( name ? { name, value: newValue } : newValue)
      }}
      right={() => <List.Icon style={styles.checkbox} icon={_checked ? 'checkbox-marked' : 'checkbox-blank-outline'}/>}
      style={styles.button}
      {...rest}
    />
  )
}

const styles = StyleSheet.create({
  button: {
    paddingLeft: 24,
    paddingRight: 16
  },
  checkbox: {
    paddingRight: 16
  }
})

export default styles
