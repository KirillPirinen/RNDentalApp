import { useCallback, useState, useMemo, useEffect, memo } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { Text } from 'react-native-paper'
import { Container, PatientAppointment } from '../components'
import { Teeth } from '../components/Teeth/Teeth'
import withObservables from '@nozbe/with-observables'
import { switchMap } from 'rxjs/operators'
import { useTheme } from 'react-native-paper'
import { ToothStatePanel } from '../components/Teeth/ToothStatePanel.js'
import { ToothNotesInput } from '../components/Teeth/ToothNotesInput.js'
import { createTooth } from '../db/actions/index.js'
import { useSettings } from '../context/general-context'

const History = memo(({ tooth }) => {
  const theme = useTheme()
  const [appointments, setAppointments] = useState([])

  useEffect(() => {
    tooth?.allAppointments.fetch().then(setAppointments)
  }, [tooth])

  return Boolean(appointments.length) && (
    <View style={styles.historyWrapper}>
      <Text variant="titleLarge" style={styles.historyTitle}>История лечения:</Text>
      {appointments.map(appointment => <PatientAppointment key={appointment.id} appointment={appointment} theme={theme}/>)}
    </View>
  )
})

const TeethFormula = ({ formula, navigation, teeth }) => {
  const { teethColorFill } = useSettings()
  const [selected, setSelected] = useState(null)
  const [history, setHistory] = useState(teethColorFill.history)
  const [statusLocalis, setStatusLocalis] = useState(teethColorFill.statusLocalis)

  const hashTeethInfo = useMemo(() => teeth.reduce((acc, tooth) => {
    acc[tooth.toothNo] = tooth
    return acc
  }, {}), [teeth])

  const pressHandler = useCallback((toothNo) => () => {
    setSelected(toothNo)
  }, [])

  useEffect(() => {
    
    const onAdultCheck = () => {
      formula.updateInstance({ hasAdultJaw: !formula.hasAdultJaw })
    }
    const onBabyCheck = () => {
      formula.updateInstance({ hasBabyJaw: !formula.hasBabyJaw })
    }
    
    navigation.setOptions({
      menu: [
      { 
        type: 'TouchableCheckbox', 
        title: 'Временные зубы', 
        onPress: onBabyCheck,
        value: formula.hasBabyJaw
      },
      { 
        type: 'TouchableCheckbox', 
        title: 'Постоянные зубы', 
        onPress: onAdultCheck,
        value: formula.hasAdultJaw
      },
      { 
        type: 'TouchableCheckbox', 
        title: 'Показывать с историей лечения', 
        onPress: setHistory,
        value: history
      },
      { 
        type: 'TouchableCheckbox', 
        title: 'Показывать status localis', 
        onPress: setStatusLocalis,
        value: statusLocalis
      }
    ]
    })
  }, [formula, history, statusLocalis])

  const selectedInstance = hashTeethInfo[selected]
  const viewBox = (formula.hasBabyJaw && !formula.hasAdultJaw) && `43.5 55.5 202 259`

  const onValueChange = (toothState) => {
    if(selectedInstance) {
      selectedInstance.updateInstance({ toothState: selectedInstance.toothState === toothState ? '' : toothState })
    } else {
      createTooth({ formulaId: formula.id, toothNo: selected, toothState })
    }
  }

  const onSaveNotes = (notes) => {
    if(selectedInstance) {
      selectedInstance.updateInstance({ notes })
    } else {
      createTooth({ formulaId: formula.id, toothNo: selected, notes })
    }
  }

  return (
    <ScrollView style={styles.container}>
        <Teeth
          withBabyTeeth={formula.hasBabyJaw}
          withAdultTeeth={formula.hasAdultJaw}
          selectedTooth={selected} 
          onPressTooth={pressHandler}
          teethRecords={hashTeethInfo}
          viewBox={viewBox}
          showTreated={history}
          showStyles={statusLocalis}
        />
      {selected && (
        <>
          <ToothStatePanel onValueChange={onValueChange} toothState={selectedInstance?.toothState} />
          <View style={styles.inputWrapper}>
            <ToothNotesInput notes={selectedInstance?.notes} onSubmit={onSaveNotes} />
          </View>
        </>
      )}
      <Container>
        {selectedInstance && <History tooth={selectedInstance} />}
      </Container>
    </ScrollView>
  )
}

export default withObservables(['route'], ({ route }) => ({
  patient: route.params.patient,
  formula: route.params.patient.formulas.observe().pipe(switchMap(([formula]) => formula.observe())),
  teeth: route.params.patient.teeth.observeWithColumns(['tooth_state'])
}))(TeethFormula)

const styles = StyleSheet.create({
  container: { flex: 1 },
  historyWrapper: { height: '90%' },
  historyTitle: { marginBottom: 10 },
  inputWrapper: { marginHorizontal: 10, marginTop: 10 }
})
