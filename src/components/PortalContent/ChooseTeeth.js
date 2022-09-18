import React, { useCallback, useState } from 'react'
import { StyleSheet, Dimensions, View } from 'react-native'
import { Modal } from 'react-native-paper'
import { Teeth } from '../Teeth/Teeth'

export const ChooseTeeth = ({ 
  __visible, 
  __defaultHandlers, 
  color,
  action,
  text,
  ...rest
}) => {
  const [selected, setSelected] = useState({})

  const onPressTooth = useCallback((toothNo) => () => {

  }, [])

  return (
    <Modal
      onDismiss={__defaultHandlers.current.clear}
      visible={__visible} 
      contentContainerStyle={styles.modal}
    >
    <Teeth
        withBabyTeeth
        withAdultTeeth
        containerStyle={{ width: '90%', alignItems: 'center'}}
        selectedTooth={selected}
        onPressTooth={onPressTooth}
        multiSelect
      />
    </Modal>
  )
}

const styles = StyleSheet.create({
  modal: { backgroundColor: 'white', padding: 20 }
})
