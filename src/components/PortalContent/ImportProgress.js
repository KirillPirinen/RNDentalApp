import React, { forwardRef, useLayoutEffect, useImperativeHandle, useRef, useState, useCallback, useEffect } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { Button, Modal, Text, ProgressBar } from 'react-native-paper'
import { createPatient } from '../../db/actions'
import { noop } from '../../utils/noop'

const Progress = forwardRef((props, forwardedRef) => {
  const [progress, setProgress] = useState(0)

  useImperativeHandle(forwardedRef, () => setProgress)

  return <ProgressBar {...props} progress={progress} color={'green'} />
})

export const ImportProgress = ({ 
  __visible, 
  __defaultHandlers,
  choosed,
  onDone
}) => {
  
  const container = useRef({
    success: 0,
    fail: 0,
    total: 0,
    failedIndexes: []
  }).current

  const [progress, setProgress] = useState(0)
  const hasErrors = Boolean(container.failedIndexes.length)

  let done = false

  if(container.total === choosed.length) {
    done = true
  }

  useEffect(() => {
    const step = 1 / choosed.length
    choosed.reduce(async (prev, contact, index) => {
      try {
        await prev
        container.success++
      } catch(e) {
        console.log(e)
        container.failedIndexes.push(index - 1)
      } finally {
        container.total++
        setProgress(prev => prev + step)
        return createPatient(contact)
      }
    }, Promise.resolve())
  }, [])

  const onExit = done && function () {
    __defaultHandlers.current.clear()
    onDone()
  }

  return (
    <Modal
      dismissable={done}
      onDismiss={onExit}
      visible={__visible} 
      contentContainerStyle={styles.modal}
    > 
      <ProgressBar progress={progress} color={hasErrors ? '#ffcc00' : '#339900'} />
      <Text>Успешно добавлено: {`${container.success} из ${choosed.length}`} </Text>
      {done && hasErrors && (
        <>
          <Text>Данные контакты импортированы с ошибками:</Text>
          <ScrollView>
            {container.failedIndexes.map(index => {
              return (<Text key={index}>{choosed[index].name}</Text>)
            })}
          </ScrollView>
        </>
      )}
      {done && <Button onPress={onExit}>Выйти</Button>}
    </Modal>
  ) 

}

const styles = StyleSheet.create({
  modal: { backgroundColor: 'white', padding: 20 }
})
