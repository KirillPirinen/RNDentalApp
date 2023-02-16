import { useCallback, useState } from 'react'
import { StyleSheet } from 'react-native'
import { IconButton, Modal, Surface, Text, Button } from 'react-native-paper'
import { Teeth } from '../Teeth/Teeth'

const init = {}

export const ChooseTeeth = ({ 
  __visible, 
  __defaultProps,
  onSubmit,
  teeth
}) => {
  const [selected, setSelected] = useState(() => {
    return teeth?.filter(Boolean).reduce((acc, tooth) => {
      acc[tooth] = true
      return acc
    }, {}) || init
  })

  const onPressTooth = useCallback((toothNo) => () => {
    setSelected(prev => ({...prev, [toothNo]: !prev[toothNo]}))
  }, [])

  const selectedArr = Object.keys(selected).reduce((acc, tooth) => {
    if(selected[tooth]) {
      acc.push(tooth)
    }
    return acc
  }, [])

  const submitHandler = () => {
    onSubmit?.(selectedArr)
    __defaultProps.clear()
  }

  return (
    <Modal
      onDismiss={__defaultProps.clear}
      visible={__visible} 
      contentContainerStyle={styles.modal}
    >
      <IconButton
        icon="broom" 
        onPress={() => setSelected(init)}
        style={styles.clear}
      />
      <IconButton
        icon="window-close" 
        onPress={__defaultProps.clear}
        style={styles.cancel}
      />
      <Teeth
        withBabyTeeth
        withAdultTeeth
        containerStyle={{ width: '100%', alignItems: 'center'}}
        selectedTooth={selected}
        onPressTooth={onPressTooth}
        multiSelect
      />
      <Surface style={styles.tooltip}>
        {Boolean(selectedArr.length) &&<Text>Вы выбрали: <Text style={styles.bold}>{selectedArr.join(', ')}</Text></Text>}
      </Surface>
      <Button 
        style={styles.submit} 
        icon="plus-thick" 
        mode="contained" 
        buttonColor='green'
        onPress={submitHandler}
      >
        Выбрать
      </Button>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modal: { backgroundColor: 'white', padding: 20 },
  bold: {
    fontWeight: '600'
  },
  tooltip: {
    padding: 20,
    minHeight: 70,
    backgroundColor: 'white'
  },
  clear: {
    position: 'absolute',
    top: 5,
    left: 5,
    zIndex: 100,
    backgroundColor:'#FFF176'
  },
  cancel: {
    position: 'absolute',
    top: 5,
    right: 5,
    zIndex: 100
  },
  submit: { marginTop: 30 }
})
