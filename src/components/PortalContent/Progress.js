import React, { useState, useEffect } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { Button, Modal, Text, ActivityIndicator } from 'react-native-paper'

const defaultTextsResolvers = {
  contactsImport: { 
    title: `Успешно добавлено`,
    error: `Данные контакты импортированы с ошибками`
  },
  filesExport: {
    title:`Успешно экспортировано`,
    error: `Файлы данных пациентов экспортированы с ошибками`
  },
}

export const Progress = ({ 
  __visible, 
  __defaultProps,
  runJob,
  mode = 'contactsImport',
  onDone
}) => {

  const [done, setDone] = useState(null)
  const hasErrors = Boolean(done?.failedValues.length)
  const { title, error } = defaultTextsResolvers[mode]
  
  const onExit = done && function () {
    __defaultProps.clear()
    onDone?.()
  }

  useEffect(() => {
    const timer = setTimeout(() => runJob().then(data => {
      if(data) setDone(data)
      else __defaultProps.clear()
    }), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Modal
      dismissable={done}
      onDismiss={onExit}
      visible={__visible} 
      contentContainerStyle={styles.modal}
    > 
      {done ? (
        <>
          <Text variant="bodyLarge">{`${title}:`} {`${done.success} из ${done.total}`} </Text>
          {hasErrors && (
            <>
              <Text variant="bodyLarge">{`${error}:`}</Text>
              <ScrollView>
                {done.failedValues.map((value, i) => <Text key={i}>{value}</Text>)}
              </ScrollView>
            </>
          )}
          <Button onPress={onExit}>Выйти</Button>
        </>
      ): <ActivityIndicator size="large" color={__defaultProps.theme.colors.primary} />}
    </Modal>
  ) 

}

const styles = StyleSheet.create({
  modal: { backgroundColor: 'white', padding: 20 }
})
