import { IconButton, Text, TextInput } from 'react-native-paper'
import { StyleSheet, View } from 'react-native'
import { FC, useEffect, useState } from 'react'
import { useToggle } from '../../utils/custom-hooks/useToggle'

export type ToothNotesInputProps = {
  notes: string;
  onSubmit: (res: string) => void;
}

export const ToothNotesInput: FC<ToothNotesInputProps> = ({ notes, onSubmit }) => {
  const [active, toggleActive] = useToggle(false)
  const [text, setText] = useState(notes)

  useEffect(() => {
    setText(notes)
  }, [notes])

  const onSave = () => {
    onSubmit?.(text)
    toggleActive()
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.heading}>
        <Text variant="titleMedium">Заметки</Text>
        <IconButton
            onPress={toggleActive}
            icon={active ? 'cancel' : text ? "file-edit" : 'file-plus'}
            size={24}
            iconColor={active ? 'red' : 'green'}
          />
      </View>
      {(text || active) && <TextInput
        mode="flat"
        onChangeText={setText}
        multiline
        value={text}
        style={styles.input}
        underlineColor="white"
        activeUnderlineColor="gray"
        editable={active}
        right={active && <TextInput.Icon icon="arrow-right-circle" forceTextInputFocus={false} onPress={onSave} />}
      />}
  </View>
  )
}

const styles = StyleSheet.create({
  input: { backgroundColor: 'white' },
  wrapper: { paddingTop: 5, paddingBottom: 15, paddingHorizontal: 15, backgroundColor: '#EEEEEE' },
  heading: { flexDirection: 'row', alignItems: 'center' },
})
