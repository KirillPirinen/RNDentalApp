import React, { useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { TextInput, Button, Menu, Divider } from 'react-native-paper'
import { Container } from '../components'
import { useModal } from '../context/modal-context'
import { createTemplate } from '../db/actions'
import { useToggle } from '../utils/custom-hooks/useToggle'
import { replaceStringByIndex } from '../utils/insertString'

const AddTemplate = ({ navigation, route: { params } }) => {

  const template = params?.template 
  const isEdit = params?.edit

  const [name, setName] = useState(template?.name || '')
  const [text, setText] = useState(template?.text || '')
  const [visible, toggleVisible] = useToggle()
  const [error, setError] = useState({})
  const [actions, dispatch] = useModal()

  const selection = useRef()
  const ref = useRef()

  const onSelection = (event) => selection.current = event.nativeEvent.selection
  const onLayout = () => {
    ref.current?.measureInWindow?.((x, y, width, height) => {
      ref.current.anchor = {x: width - 20, y: y + 50}
    })
  }

  const onInsertTag = (tag) => () => {
    const carret = selection.current

    toggleVisible()

    if(carret) {
      return setText(prev => replaceStringByIndex(prev, tag, carret.start, carret.end))
    }

    setText(tag)
    
  }

  const onSubmit = () => {
    if(!name) {
      return setError({ name: true })
    }

    if(isEdit) {
      return template?.updateInstance({ text, name }).then(navigation.goBack)
    }

    createTemplate({ text, name }).then(() => {
      setTimeout(() => {
        dispatch({ 
          type: actions.INFO,
          payload: { 
            text: 'Вы успешно добавили новый шаблон'
          }
        })
      }, 500)
      navigation.popToTop()
    })
  }

  const onChangeTextName = (text) => {
    if(error.name) setError({})
    setName(text)
  }

  
  return (
      <ScrollView keyboardShouldPersistTaps='handled'>
        <Container>
          <TextInput
            label="Название шаблона"
            mode="outlined"
            value={name}
            onChangeText={onChangeTextName}
            error={error.name}
          />
          <View ref={ref} onLayout={onLayout}>
            <TextInput
              label="Текст"
              mode="outlined"
              value={text}
              onChangeText={setText}
              multiline
              numberOfLines={10}
              style={styles.multiline}
              onSelectionChange={onSelection}
              right={<TextInput.Icon icon="variable" onPress={toggleVisible}/>}
            />
            <Menu
              visible={visible}
              onDismiss={toggleVisible}
              anchor={ref.current?.anchor}
              contentStyle={{ backgroundColor: 'white' }}
            >
              <Menu.Item
                style={styles.item}
                titleStyle={styles.itemTitle} 
                onPress={onInsertTag('[-date-]')} 
                title="Дата приема" 
              />
              <Divider bold/>
              <Menu.Item
                style={styles.item}
                titleStyle={styles.itemTitle} 
                onPress={onInsertTag('[-time-]')} 
                title="Время приема" 
              />
              <Divider bold/>
              <Menu.Item
                style={styles.item}
                titleStyle={styles.itemTitle} 
                onPress={onInsertTag('[-name-]')} 
                title="Имя пациента" 
              />
            </Menu>
          </View>
          <Button 
            style={{ marginTop: 30 }} 
            icon="plus-thick" 
            mode="contained" 
            buttonColor={'green'}
            onPress={onSubmit}
          >
            {isEdit ? 'Сохранить изменения' : 'Добавить шаблон'}
          </Button>
        </Container>
      </ScrollView>
  )
}

const styles = StyleSheet.create({
  multiline: { marginTop: 20 },
  itemTitle: { fontSize:14 },
  item: { height: 40 }
})

export default AddTemplate

