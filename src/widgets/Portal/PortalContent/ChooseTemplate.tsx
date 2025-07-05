import React, { useState, useLayoutEffect, FC } from 'react'
import { View, StyleSheet, Linking } from 'react-native'
import { Modal, Text, Button, RadioButton, Divider, 
  Surface } from 'react-native-paper'
import getDatabase from '../../../db'
import { parseTemplateByPatient } from '../../../utils/parseTemplate'
import actions from '../../../context/general-context/action-types'
import { setStringAsync } from 'expo-clipboard'
import { ContextedPortalDefaultProps } from '..'
import Patient from '../../../db/models/Patient'
import Template from '../../../db/models/Template'
import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'

export type ChooseTemplateModes = keyof typeof Links

const Links = {
  telegram: (phone: string) => `tg://resolve?phone=${phone}`,
  whatsapp: (phone: string, text = '') => `whatsapp://send?text=${text}&phone=${phone}`
}

const createDefaultAction = (mode: ChooseTemplateModes) => ({ 
    type: actions.INFO,
    payload: { 
      text: t`К сожалению мы не смогли открыть ${mode}, возможно он не установлен`,
      color: 'errorContainer'
    }
} as const)

export type ChooseTemplateProps = ContextedPortalDefaultProps<{
  patient: Patient;
  mode: keyof typeof Links;
  phone: string;
}>

export const ChooseTemplate: FC<ChooseTemplateProps> = ({ 
  __visible, 
  __defaultProps,
    patient,
    mode,
    phone
}) => {
  const [templates, setTemplates] = useState<Array<{ id: string, name: string, text: string }>>([])
  const [choosed, setChoosed] = useState<string>('')
  
  const isTelegram = mode === "telegram"

  const onSendTemplate = async () => {
    try {
      if (isTelegram && choosed) {
        await setStringAsync(choosed)
      }
      await Linking.openURL(Links[mode](phone, choosed))
      __defaultProps.clear()
    } catch {
      __defaultProps.dispatch(createDefaultAction(mode))
    }
  }

  const onSendTemplateBare = async () => {    
    try {
      await Linking.openURL(Links[mode](phone, ''))
      __defaultProps.clear()
    } catch {
      __defaultProps.dispatch(createDefaultAction(mode))
    }
  }

  useLayoutEffect(() => {
    getDatabase().get<Template>('templates').query().fetch()
      .then((dbTemplates) => {
        if(dbTemplates.length) {
          // @ts-ignore
          parseTemplateByPatient(dbTemplates, patient).then(setTemplates)
        } else {
          onSendTemplateBare()
          __defaultProps.clear()
        }
      })
  }, [])

  return (
    <Modal
      onDismiss={__defaultProps.clear}
      visible={__visible && Boolean(templates.length)} 
      contentContainerStyle={styles.modal}
    > 
    <Text variant="headlineSmall"><Trans>Ваши шаблоны</Trans>:</Text>
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
            <Trans>Telegram не поддерживает предзагруженные сообщения, по-этому после открытия чата нужно вставить скопированный из шаблона текст</Trans>
          </Text>
          <Divider bold/>
        </>
      )}
      <View style={styles.buttonWrapper}>
        <Button
            disabled={!choosed}
            icon={isTelegram ? 'content-copy' : 'email-fast'}
            textColor="green"
            onPress={onSendTemplate}
          > 
            {isTelegram ? t`Копировать сообщение и перейти в чат` : t`Отправить`}
        </Button>
        <Button
            icon="book-open-blank-variant"
            textColor="black"
            onPress={onSendTemplateBare}
          > 
            <Trans>Без шаблона</Trans>
        </Button>
        <Button
            icon="window-close"
            textColor="gray"
            onPress={__defaultProps.clear}
          > 
            <Trans>Отмена</Trans>
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
