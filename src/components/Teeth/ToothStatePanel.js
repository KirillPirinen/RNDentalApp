import { SegmentedButtons } from 'react-native-paper'

import { StyleSheet } from 'react-native'
import { toothStates } from '../../consts'
import { toothFillColors } from '../../styles/teeth'

const styles = StyleSheet.create({
  panel: { 
    marginTop: 10, 
    justifyContent: 'center', 
  },
  button: {
    backgroundColor: 'white',
    flexShrink: 1,
    borderRightWidth: 1,
    marginLeft: 2,
    minWidth: '13%'
  }
})

const buttons = [
  {
    value: toothStates.caries,
    label: 'С',
    style: [styles.button, { backgroundColor: '#ffbb44' }],
    showSelectedCheck: true
  },
  {
    value: toothStates.pulpitis,
    label: 'P',
    style: [styles.button, { backgroundColor: toothFillColors.pulpitis.fill }],
    showSelectedCheck: true
  },
  {
    value: toothStates.periodontitis,
    label: 'Pt',
    style: [styles.button, { backgroundColor: toothFillColors.periodontitis.fill }],
    showSelectedCheck: true
  },
  {
    value: toothStates.root,
    label: 'R',
    style: [styles.button, { borderWidth: 2, borderRightWidth: 2, borderStyle:'dashed', borderColor: toothFillColors.root.stroke }],
    showSelectedCheck: true
  },
  {
    value: toothStates.crown,
    label: 'К',
    style: [styles.button, { borderWidth: 2, borderRightWidth: 2, borderColor: toothFillColors.crown.stroke }],
    showSelectedCheck: true
  },
  {
    value: toothStates.absent,
    label: 'О',
    style: [styles.button, { borderWidth: 2, borderRightWidth: 2, borderColor: toothFillColors.absent.stroke }],
    showSelectedCheck: true
  },
  {
    value: toothStates.artificial,
    label: 'И',
    style: [styles.button, { backgroundColor: toothFillColors.artificial.fill }],
    showSelectedCheck: true
   },
]

export const ToothStatePanel = ({ toothState, onValueChange }) => {
  return (
    <SegmentedButtons
      value={toothState}
      onValueChange={onValueChange}
      buttons={buttons}
      style={styles.panel}
    />
  )
}
