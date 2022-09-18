import React, { useCallback ,useState, useMemo, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Container } from '../components'
import { Teeth } from '../components/Teeth/Teeth'
import withObservables from '@nozbe/with-observables'
import { switchMap } from 'rxjs/operators'

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

const styles = StyleSheet.create({
  container: { flex: 1 }
})

const TeethFormula = ({ formula, navigation, patient, teeth }) => {
  
  const [selected, setSelected] = useState(null)

  const hashTeethInfo = useMemo(() => {
    return teeth.reduce((acc, tooth) => {
      acc.toothNo = tooth
      return acc
    }, {})
  }, [teeth])

  const hashTest = {
    55: { toothState: 'absent' },
    54: { toothState: 'absent' },
    53: { toothState: 'scheduled' },
    52: { toothState: 'crown' },
    51: { toothState: 'cured' }
  }
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
    <View style={styles.container}>
        <Teeth
          withBabyTeeth={formula.hasBabyJaw}
          withAdultTeeth={formula.hasAdultJaw}
          selectedTooth={selected} 
          onPressTooth={pressHandler}
          teethRecords={hashTest}
          viewBox={viewBox}
        />
      <Container>
        {/* <ToothStatePanel initalValue="O" /> */}
        <Text>Privet</Text>
      </Container>
    </View>
  )
}

export default withObservables(['route'], ({ route }) => ({
  patient: route.params.patient,
  formula: route.params.patient.formulas.observe()
    .pipe(switchMap(formulas => formulas[0].observe())),
  teeth: route.params.patient.formulas.observe()
    .pipe(switchMap(formulas => formulas[0].teeth.observe()))
}))(TeethFormula)

