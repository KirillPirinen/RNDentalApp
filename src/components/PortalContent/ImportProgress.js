import React, { forwardRef, useLayoutEffect, useImperativeHandle, useRef, useState, useCallback } from 'react'
import { Button, Modal, Text, ProgressBar } from 'react-native-paper'
import { createPatient } from '../../db/actions'

const Progress = forwardRef((props, forwardedRef) => {
  const [progress, setProgress] = useState(0)

  useImperativeHandle(forwardedRef, () => setProgress)

  return <ProgressBar {...props} progress={progress} color={'green'} />
})

const styles = { backgroundColor: 'white', padding: 20 }
export const ImportProgress = ({ 
  __visible, 
  __defaultHandlers,
  choosed
}) => {
  const [state, setState] = useState()
  const refCb = useCallback((setProgress) => {
    const step = 1 / choosed.length
    console.log('run1')
    // choosed.reduce((prev, contact, index) => {
    //   return prev.catch(() => {
    //     console.log(index)
    //   }).finally(() => {
    //     setProgress(prev => prev + step)
    //     return createPatient(contact)
    //   })
    // }, Promise.resolve())
  }, [])

  return (
    <Modal 
      visible={__visible} 
      onDismiss={__defaultHandlers.current.clear} 
      contentContainerStyle={styles}
    > 
      <Progress ref={refCb} />
      <Button onPress={() => setState(prev => !prev)}>Privet</Button>
    </Modal>
  ) 

}
