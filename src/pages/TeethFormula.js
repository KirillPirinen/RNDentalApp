import React, { useCallback ,useState, useMemo, useEffect, memo } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { Text } from 'react-native-paper'
import { Container, PatientAppointment } from '../components'
import { Teeth } from '../components/Teeth/Teeth'
import withObservables from '@nozbe/with-observables'
import { switchMap } from 'rxjs/operators'
import { useTheme } from 'react-native-paper'

// selected: {
//   fill:'red'
// },
// absent: {
//   fill: '#bbbbbb'
// },
// scheduled: {
//   fill: '#9abd57'
// },
// treatment: {
//   fill: '#d2e74c'
// },
// cured: {
//   fill: '#3e9758'
// },

const initState = []
const AppointmentWrapper = memo(({ tooth }) => {
  const theme = useTheme()
  const [appointments, setAppointments] = useState(initState)

  //const renderItem = useCallback(({ item }) => <PatientAppointment theme={theme} appointment={item}/>, [])

  useEffect(() => {
    if(tooth) {
      tooth.allAppointments.fetch().then(setAppointments)
    } else {
      setAppointments(initState)
    }
  }, [tooth])

  return (
    <View style={{ height: '90%' }}>
      <Text variant="titleLarge" style={{ marginBottom: 10 }}>История лечения:</Text>
      {appointments.map(appointment => <PatientAppointment appointment={appointment} theme={theme}/>)}
    </View>
  )
})

const styles = StyleSheet.create({
  container: { flex: 1 }
})

const TeethFormula = ({ formula, navigation, patient, teeth }) => {

  const [selected, setSelected] = useState(null)

  const hashTeethInfo = useMemo(() => {
    return teeth.reduce((acc, tooth) => {
      acc[tooth.toothNo] = tooth
      return acc
    }, {})
  }, [teeth])

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
      }
    ]
    })
  }, [formula])

  const viewBox = (formula.hasBabyJaw && !formula.hasAdultJaw) && `43.5 55.5 202 259`

  return (
    <ScrollView style={styles.container}>
        <Teeth
          withBabyTeeth={formula.hasBabyJaw}
          withAdultTeeth={formula.hasAdultJaw}
          selectedTooth={selected} 
          onPressTooth={pressHandler}
          teethRecords={hashTeethInfo}
          viewBox={viewBox}
        />
      <Container>
        {/* <ToothStatePanel initalValue="O" /> */}
        {hashTeethInfo[selected] && <AppointmentWrapper tooth={hashTeethInfo[selected]}/>}
      </Container>
    </ScrollView>
  )
}

export default withObservables(['route'], ({ route }) => ({
  patient: route.params.patient,
  formula: route.params.patient.formulas.observe().pipe(switchMap(formulas => formulas[0].observe())),
  teeth: route.params.patient.teeth
}))(TeethFormula)

