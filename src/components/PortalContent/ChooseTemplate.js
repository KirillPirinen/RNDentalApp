import React, { useRef, useState, useCallback, useEffect } from 'react'
import { ScrollView, View, StyleSheet } from 'react-native'
import { Modal, Text, Button, RadioButton, Divider } from 'react-native-paper'
import { database } from '../../db'

export const ChooseTemplate = ({ 
  __visible, 
  __defaultHandlers,
    onSend,
    patient,
    appointment
}) => {
  const [templates, setTemplates] = useState([])
  const [choosed, setChoosed] = useState()
  const state = __defaultHandlers.current.navigation.getState()

  useEffect(() => {
    database.get('templates').query().fetch().then(setTemplates)
  }, [])

  const onParseTemplate = () => {
    console.log(state)
  }

  return (
    <Modal
      onDismiss={__defaultHandlers.current.clear}
      visible={__visible} 
      contentContainerStyle={styles.modal}
    > 
    <Text>Ваши шаблоны:</Text>
    <RadioButton.Group onValueChange={setChoosed} value={choosed}>
      <View style={styles.radioWrapper}>
        {templates.map(({ name, text, id }) => (
          <View key={id} style={styles.radio}>
            <Text>{name}</Text>
            <RadioButton value={text} />
          </View>
          )
        )}
      </View>
    </RadioButton.Group>
    <Divider bold/>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', flexWrap:'wrap' }}>
      <Button
          disabled={!choosed}
          icon="email-fast"
          textColor="green"
          size={24}
          onPress={onParseTemplate}
        > 
          Отправить
      </Button>
      <Button
          icon="book-open-blank-variant"
          textColor="black"
          size={24}
          onPress={() => onSend('')}
        > 
          Без шаблона
      </Button>
      <Button
          icon="window-close"
          textColor="gray"
          size={24}
          onPress={__defaultHandlers.current.clear}
        > 
          Отмена
      </Button>
      </View>
    </Modal>
  ) 

}

const styles = StyleSheet.create({
  modal: { backgroundColor: 'white', padding: 20 },
  radioWrapper: { flexDirection: 'row', flexWrap:'wrap' },
  radio: { 
    flexDirection: 'row', 
    alignItems:'center', 
    margin: 5,
    padding: 5
  }
})
