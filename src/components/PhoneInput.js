import { useState } from 'react'
import { View, StyleSheet } from "react-native"
import { TextInput, Button } from "react-native-paper"

function Input ({ label, onChange, onDeletePhone, id, value, link }) {

  const removeInput = () => {
    onDeletePhone(id)

    if(link) {
      return onChange(id, { link, delete: true })
    }

    onChange(id, null)
  }

  const changeHandler = ({ nativeEvent }) => {
    const res = { number: nativeEvent.text }

    if(link) {
      res.link = link
    }

    onChange(id, res)
  }

  return (
    <TextInput
      mode="outlined"
      label={label}
      style={styles.input}
      keyboardType="phone-pad"
      onChange={changeHandler}
      right={<TextInput.Icon icon="delete" onPress={removeInput} />}
      defaultValue={value}
    />
  )
}

export const PhoneInput = ({ onChange, phones }) => {
  const [inputs, setInputs] = useState(() => Object.values(phones))

  const onAddPhone = () => setInputs(prev => [...prev, prev.length + 1])

  const onDeletePhone = (id) => setInputs(inputs.filter(field => {
      if(typeof field === 'object') {
        return field.id !== id
      }
      return field !== id
  }))

  return (
    <View style={styles.wrapper}>
      {inputs.map((field, index) => {
        const id = field.id || field
        return (
          <Input
            key={id}
            id={id}
            label={`Телефон_${index + 1}`} 
            onChange={onChange}
            onDeletePhone={onDeletePhone}
            value={field.number}
            link={field.link}
          />
        )
      }
      )}
      <Button 
        style={{ marginTop: 30 }} 
        icon="plus-thick" 
        mode="contained" 
        onPress={onAddPhone}
        buttonColor={'green'}
      >
        Добавить телефон
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: { marginTop: 20, marginLeft: 0 },
  input: { marginTop: 12 }
})
