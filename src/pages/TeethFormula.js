import React, { useCallback ,useState, useMemo } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import { ToggleButton, Switch } from 'react-native-paper'
import { Container } from '../components';
import { Teeth } from '../components/Teeth/Teeth'
import withObservables from '@nozbe/with-observables';
import { ToothStatePanel } from '../components/Teeth/ToothStatePanel';
import { switchMap } from 'rxjs/operators'

const originalWidth = 289;
const originalHeight = 370;
const width = Dimensions.get("window").width

const styles = StyleSheet.create({
  container: { flex: 1 },
  svgWrapper: { 
    width, 
    aspectRatio: originalWidth / originalHeight, 
    backgroundColor:'white',
    borderBottomWidth: 1
  }
})

const TeethFormula = ({ formula, navigation, patient, teeth }) => {
  
  const viewBox = (formula.hasBabyJaw && !formula.hasAdultJaw) ? `43.5 55.5 202 259` : `0 0 ${originalWidth} ${originalHeight}`

  const [selected, setSelected] = useState(null)

  const hashTeethInfo = useMemo(() => {
    return teeth.reduce((acc, tooth) => {
      acc.toothNo = tooth
      return acc
    }, {})
  }, [teeth])

 
  const pressHandler = useCallback((toothNo) => () => {
    setSelected(toothNo)
  }, [])

  const onToggleSwitch = (e) => {
    formula.updateInstance({ hasBabyJaw: !formula.hasBabyJaw })
  }
  const onToggleSwitch2 = (e) => {
    formula.updateInstance({ hasAdultJaw: !formula.hasAdultJaw })
  }

  return (
    <View style={styles.container}>
      <View style={styles.svgWrapper}>
          <Teeth
            withBabyTeeth={formula.hasBabyJaw}
            withAdultTeeth={formula.hasAdultJaw}
            selectedTooth={selected} 
            pressHandler={pressHandler}
            width="100%" 
            height="100%" 
            viewBox={viewBox}
          />
      </View>
      <Container>
        <ToothStatePanel initalValue="O" />
          <Switch 
            value={formula.hasBabyJaw} 
            onValueChange={onToggleSwitch} 
          />
          <Switch 
            value={formula.hasAdultJaw} 
            onValueChange={onToggleSwitch2} 
          />
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

