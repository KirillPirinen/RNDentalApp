import { useCallback, useState, useMemo, useEffect, memo, FC } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { Text } from 'react-native-paper'
import { Container, PatientAppointment } from '../components'
import { Teeth } from '../components/Teeth/Teeth'
import withObservables from '@nozbe/with-observables'
import { switchMap } from 'rxjs/operators'
import { ToothStatePanel } from '../components/Teeth/ToothStatePanel'
import { ToothNotesInput } from '../components/Teeth/ToothNotesInput'
import { createTooth } from '../db/actions'
import { useSettings } from '../context/general-context'
import Tooth from '../db/models/Tooth'
import Appointment from '../db/models/Appointment'
import Formula from '../db/models/Formula'
import { NavigationProp } from '@react-navigation/native'
import { useAppTheme } from '../styles/themes'

type HistoryProps = {
  tooth: Tooth;
}

const History: FC<HistoryProps> = memo(({ tooth }) => {
  const theme = useAppTheme()
  const [appointments, setAppointments] = useState<Appointment[]>([])

  useEffect(() => {
    tooth?.allAppointments.fetch().then(setAppointments)
  }, [tooth])

  return Boolean(appointments.length) && (
    <View style={styles.historyWrapper}>
      <Text variant="titleLarge" style={styles.historyTitle}>История лечения:</Text>
      {appointments.map(appointment => <PatientAppointment key={appointment.id} appointment={appointment} theme={theme} />)}
    </View>
  )
})

export type TeethFormulaProps = {
  formula: Formula;
  navigation: NavigationProp<ReactNavigation.RootParamList>;
  teeth: Array<Tooth>;
}

const TeethFormula: FC<TeethFormulaProps> = ({ formula, navigation, teeth }) => {
  const { teethColorFill } = useSettings()
  const [selected, setSelected] = useState<string | undefined>()
  const [history, setHistory] = useState(teethColorFill.history)
  const [statusLocalis, setStatusLocalis] = useState(teethColorFill.statusLocalis)

  const hashTeethInfo = useMemo(() => teeth.reduce<Record<string, Tooth>>((acc, tooth) => {
    acc[tooth.toothNo] = tooth
    return acc
  }, {}), [teeth])

  const pressHandler = useCallback((toothNo: string) => {
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
        label: 'Временные зубы', 
        onPress: onBabyCheck,
        value: formula.hasBabyJaw
      },
      { 
        type: 'TouchableCheckbox', 
        label: 'Постоянные зубы', 
        onPress: onAdultCheck,
        value: formula.hasAdultJaw
      },
      { 
        type: 'TouchableCheckbox', 
        label: 'Показывать с историей лечения', 
        onPress: setHistory,
        value: history
      },
      { 
        type: 'TouchableCheckbox', 
        label: 'Показывать status localis', 
        onPress: setStatusLocalis,
        value: statusLocalis
      }
    ]
    })
  }, [formula, history, statusLocalis])

  const selectedInstance = selected ? hashTeethInfo[selected] : undefined

  const viewBox = (formula.hasBabyJaw && !formula.hasAdultJaw) ? `43.5 55.5 202 259` : undefined

  const onValueChange = (toothState: string) => {
    if(selectedInstance) {
      selectedInstance.updateInstance({ toothState: selectedInstance.toothState === toothState ? '' : toothState })
    } else if (selected) {
      createTooth({ formulaId: formula.id, toothNo: selected, toothState })
    }
  }

  const onSaveNotes = (notes: string) => {
    if(selectedInstance) {
      selectedInstance.updateInstance({ notes })
    } else if (selected) {
      createTooth({ formulaId: formula.id, toothNo: selected, notes, toothState: '' })
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
          <ToothStatePanel onValueChange={onValueChange} toothState={selectedInstance?.toothState ?? ''} />
          <View style={styles.inputWrapper}>
            <ToothNotesInput notes={selectedInstance?.notes ?? ''} onSubmit={onSaveNotes} />
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
