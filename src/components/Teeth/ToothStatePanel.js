import { SegmentedButtons } from 'react-native-paper'

import { StyleSheet } from 'react-native'
import { toothStates } from '../../consts'

const buttons = [
  {
    value: toothStates.pulpitis,
    label: 'П',
  },
  {
    value: toothStates.caries,
    label: 'К',
  },
  {
   value: toothStates.artificial,
   label: 'И',
  },
  {
    value: toothStates.absent,
    label: 'О',
  },
  {
    value: toothStates.root,
    label: 'R',
  },
]

export const ToothStatePanel = ({ toothState, onValueChange }) => {
  return (
    <SegmentedButtons
     value={toothState}
     onValueChange={onValueChange}
     buttons={buttons}
     density="high"
     style={styles.panel}
   />
  )
}

const styles = StyleSheet.create({
  panel: { marginTop: 10, justifyContent: 'center' }
})
