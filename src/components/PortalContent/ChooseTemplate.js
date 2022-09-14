import React, { useState, useLayoutEffect } from 'react'
import { View, StyleSheet, Linking } from 'react-native'
import { Modal, Text, Button, RadioButton, Divider, 
  Surface } from 'react-native-paper'
import { database } from '../../db'
import { parseTemplateByPatient } from '../../utils/parseTemplateByPatient'
import actions from '../../context/modal-context/action-types'
import { setStringAsync } from 'expo-clipboard'

const Links = {
  telegram: (phone) => `tg://resolve?phone=${phone}`,
  whatsapp: (phone, text) => `whatsapp://send?text=${text}&phone=${phone}`
}

const createDefaultAction = (mode) => ({ 
    type: actions.INFO,
    payload: { 
      text: `К сожалению мы не смогли открыть ${mode}, возможно он не установлен`,
      color: 'error'
    }
})

export const ChooseTemplate = ({ 
  __visible, 
  __defaultHandlers,
    patient,
    mode,
    phone
}) => {
  const [templates, setTemplates] = useState([])
  const [choosed, setChoosed] = useState()
  
  const isTelegram = mode === "telegram"

  const onSendTemplate = async () => {
    try {
      if(isTelegram && choosed) {
        await setStringAsync(choosed)
      }
      await Linking.openURL(Links[mode](phone, choosed))
      __defaultHandlers.current.clear()
    } catch {
      __defaultHandlers.current.dispatch(createDefaultAction(mode))
    }
  }

  const onSendTemplateBare = async () => {    
    try {
      await Linking.openURL(Links[mode](phone, ''))
      __defaultHandlers.current.clear()
    } catch {
      __defaultHandlers.current.dispatch(createDefaultAction(mode))
    }
  }

  useLayoutEffect(() => {
    database.get('templates').query().fetch()
      .then((dbTemplates) => {
        if(dbTemplates.length) {
          parseTemplateByPatient(dbTemplates, patient).then(setTemplates)
        } else {
          onSendTemplateBare()
          __defaultHandlers.current.clear()
        }
      })
  }, [])

  return (
    <Modal
      onDismiss={__defaultHandlers.current.clear}
      visible={__visible && Boolean(templates.length)} 
      contentContainerStyle={styles.modal}
    > 
    <Text variant="headlineSmall">Ваши шаблоны:</Text>
    <RadioButton.Group onValueChange={setChoosed} value={choosed}>
      <View style={styles.radioWrapper}>
        {templates.map(({ name, text, id }) => (
            <RadioButton.Item key={id} label={name} value={text} />
          )
        )}
      </View>
    </RadioButton.Group>
    {choosed && (
      <Surface elevation={1} style={styles.choosed}>
        <Text 
          variant="bodyLarge" 
          style={{ color: 'black' }}
          selectable={true}
        >{choosed}</Text>
      </Surface>
    )}
    <Divider bold/>
      {isTelegram && choosed && (
        <>
          <Text style={{ textAlign:'center'}}>
            Telegram не поддерживает предзагруженные сообщения, по-этому после открытия чата нужно вставить скопированный из шаблона текст
          </Text>
          <Divider bold/>
        </>
      )}
      <View style={styles.buttonWrapper}>
        <Button
            disabled={!choosed}
            icon={isTelegram ? 'content-copy' : 'email-fast'}
            textColor="green"
            size={24}
            onPress={onSendTemplate}
          > 
            {isTelegram ? 'Копировать сообщение и перейти в чат' : 'Отправить'}
        </Button>
        <Button
            icon="book-open-blank-variant"
            textColor="black"
            size={24}
            onPress={onSendTemplateBare}
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
  radioWrapper: { flexDirection: 'row', flexWrap:'wrap', margin: 0 },
  radio: { 
    flexDirection: 'row', 
    alignItems:'center', 
    margin: 5,
    padding: 5
  },
  link: { textDecorationLine: 'underline' },
  choosed: { 
    padding: 10,
    borderRadius: 2,
    marginBottom: 20,
    backgroundColor:'white'
  },
  buttonWrapper: { 
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap:'wrap',
    marginTop: 5
  }
})

// const onTelegramApp = () => {
//   Linking.openURL(`tg://resolve?phone=${getPrimaryPhoneNumber(phones)}`)
//   .catch(() => {
//     dispatch({ 
//       type: actions.INFO,
//       payload: { 
//         text: 'К сожалению мы не смогли открыть telegram, возможно он не установлен',
//         color: 'error'
//       }
//     })
//   })
// }

//`whatsapp://send?text=${text}&phone=${getPrimaryPhoneNumber(phones)}`
//`tg://resolve?phone=${getPrimaryPhoneNumber(phones)}`

/* dispatch({
  type: actions.INFO,
  payload: { 
    text: 'К сожалению мы не смогли открыть whatsapp, возможно он не установлен',
    color: 'error' 
  }
}) */
