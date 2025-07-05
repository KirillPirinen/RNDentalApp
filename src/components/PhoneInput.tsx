import { FC, useState } from 'react'
import { View, StyleSheet } from "react-native"
import { TextInput, Button } from "react-native-paper"
import Phone from '../db/models/Phone';
import { Trans } from '@lingui/react/macro';
import { t } from '@lingui/core/macro' 

export type InputChangeDTO = {
  id?: string;
  number: string;
  link?: Phone;
  delete?: boolean;
}

type innerInputProps = {
  label: string;
  onChange: (key: string | number, value: InputChangeDTO | null) => void;
  onDeletePhone: (key: string | number) => void;
  id: string | number;
  value?: string;
  link?: Phone;
}

const Input: FC<innerInputProps> = ({ label, onChange, onDeletePhone, id, value, link }) => {

  const removeInput = () => {
    onDeletePhone(id)

    if (link) {
      return onChange(id, { number: value ?? '', link, delete: true })
    }

    onChange(id, null)
  }

  const changeHandler = (number: string) => {
    const res: InputChangeDTO = { number }

    if (link) {
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
      onChangeText={changeHandler}
      right={<TextInput.Icon icon="delete" onPress={removeInput} />}
      defaultValue={value}
    />
  )
}

export type PhoneInputTypes = {
  onChange: innerInputProps['onChange'];
  phones: Record<string, { id?: string, number: string, link: Phone }>;
}

export const PhoneInput: FC<PhoneInputTypes> = ({ onChange, phones }) => {
  const [inputs, setInputs] = useState<Array<{ id: string, number: string, link: Phone } | number>>(() => Object.values(phones))

  const onAddPhone = () => setInputs(prev => [...prev, prev.length + 1])

  const onDeletePhone = (id: string | number) => setInputs(inputs.filter(field => {
      if(typeof field === 'object') {
        return field.id !== id
      }
      return field !== id
  }))

  return (
    <View style={styles.wrapper}>
      {inputs.map((field, index) => {
        const isRealPhone = typeof field === 'object'
        const id = isRealPhone ? field.id : field
        return (
          <Input
            key={id}
            id={id}
            label={`${t`Телефон`} ${index + 1}`} 
            onChange={onChange}
            onDeletePhone={onDeletePhone}
            value={isRealPhone ? field.number : undefined}
            link={isRealPhone ? field.link : undefined}
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
        <Trans>Добавить телефон</Trans>
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: { marginTop: 20, marginLeft: 0 },
  input: { marginTop: 12 }
})
