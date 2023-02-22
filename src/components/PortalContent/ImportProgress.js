import React, { useRef, useState, useEffect } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { Button, Modal, Text, ActivityIndicator } from 'react-native-paper'
import { createPatient } from '../../db/actions'

export const ImportProgress = ({ 
  __visible, 
  __defaultProps,
  choosed,
  onDone
}) => {

  const container = useRef({
    success: 0,
    fail: 0,
    total: 0,
    failedIndexes: []
  }).current

  const [done, setDone] = useState(false)
  const hasErrors = Boolean(container.failedIndexes.length)

  useEffect(() => {
    const timer = setTimeout(() => {
      Promise.all(choosed.reduce(async (prev, contact, index) => {
        try {
          await prev
          container.success++
        } catch(e) {
          container.failedIndexes.push(index - 1)
        } finally {
          container.total++
          return createPatient(contact)
        }
      }, Promise.resolve()).then(() => setDone(true)))
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const onExit = done && function () {
    __defaultProps.clear()
    onDone()
  }

  return (
    <Modal
      dismissable={done}
      onDismiss={onExit}
      visible={__visible} 
      contentContainerStyle={styles.modal}
    > 
      {done ? (
        <>
          <Text variant="bodyLarge">Успешно добавлено: {`${container.success} из ${choosed.length}`} </Text>
          {hasErrors && (
            <>
              <Text variant="bodyLarge">Данные контакты импортированы с ошибками:</Text>
              <ScrollView>
                {container.failedIndexes.map(index => {
                  return (<Text key={index}>{choosed[index].name}</Text>)
                })}
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
