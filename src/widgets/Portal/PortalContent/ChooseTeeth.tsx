import { FC, useCallback, useMemo, useState } from 'react'
import { StyleSheet } from 'react-native'
import { IconButton, Modal, Surface, Text, Button } from 'react-native-paper'
import { Teeth } from '../../../components/Teeth/Teeth'
import { ContextedPortalDefaultProps } from '..'
import { Trans } from '@lingui/macro'
import Tooth from '../../../db/models/Tooth'

export type ChooseTeethProps = ContextedPortalDefaultProps<{
  onSubmit: (selectedArr: string[]) => void
  teeth: string[]
  teethModels?: Tooth[]
}>

const init: Record<string, boolean> = {}

export const ChooseTeeth: FC<ChooseTeethProps> = ({ 
  __visible, 
  __defaultProps,
  onSubmit,
  teeth,
  teethModels
}) => {
  const [selected, setSelected] = useState(() => {
    return teeth?.filter(Boolean).reduce<Record<string, boolean>>((acc, tooth) => {
      acc[tooth] = true
      return acc
    }, {}) || init
  })

  const hashTeethInfo = useMemo(() => teethModels?.reduce<Record<string, Tooth>>((acc, tooth) => {
    acc[tooth.toothNo] = tooth
    return acc
  }, {}), [teethModels])

  const onPressTooth = useCallback((toothNo: string) => {
    setSelected(prev => ({...prev, [toothNo]: !prev[toothNo]}))
  }, [])

  const selectedArr = Object.keys(selected).reduce<Array<string>>((acc, tooth) => {
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
        containerStyle={{ width: '100%', alignItems: 'center'}}
        selectedTooth={selected}
        onPressTooth={onPressTooth}
        multiSelect
        withBabyTeeth
        withAdultTeeth
        teethRecords={hashTeethInfo}
        showStyles
        showTreated
      />
      <Surface style={styles.tooltip}>
        {Boolean(selectedArr.length) && <Text><Trans>Вы выбрали</Trans>: <Text style={styles.bold}>{selectedArr.join(', ')}</Text></Text>}
      </Surface>
      <Button 
        style={styles.submit} 
        icon="plus-thick" 
        mode="contained" 
        buttonColor='green'
        onPress={submitHandler}
      >
        <Trans>Выбрать</Trans>
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
