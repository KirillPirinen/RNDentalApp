import { useCallback, useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { List } from 'react-native-paper'

export const SettingsCheckbox = ({ onChange, style, name, initial, radio, value, ...rest }) => {
  const [_checked, setChecked] = useState(initial)

  useEffect(() => {
    value !== _checked && setChecked(value)
  }, [value])

  const iconBlank = radio ? 'checkbox-blank-circle-outline' : 'checkbox-blank-outline'
  const iconChecked = radio ? 'checkbox-marked-circle' : 'checkbox-marked'
  return (
    <List.Item
      onPress={() => {
        const newValue = !_checked
        if(!radio || (newValue && radio)) {
          setChecked(newValue)
          onChange(name ? { name, value: newValue } : newValue)
        }
      }}
      right={() => <List.Icon style={styles.checkbox} icon={_checked ? iconChecked : iconBlank}/>}
      style={styles.button}
      {...rest}
    />
  )
}

export const SettingsRadioGroup = ({ onChange, style, name, group, initial, ...rest }) => {
  const [value, setValue] = useState(initial)

  const handleChange = useCallback(({ name: newValue, value }) => {
    if (value) {
      setValue(newValue)
      onChange(name ? { name, value: newValue } : newValue)
    }
  }, [onChange, setValue, name])

  return (
    <>
      {group?.map(radio => {
        return (
          <SettingsCheckbox 
            key={radio.name}
            value={value === radio.name} 
            onChange={handleChange}
            {...radio}
            radio
          />
        )
      })}
    </>
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
