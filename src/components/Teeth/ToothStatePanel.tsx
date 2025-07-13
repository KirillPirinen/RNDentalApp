import { SegmentedButtons } from 'react-native-paper'

import { StyleSheet } from 'react-native'
import { toothStates } from '../../consts'
import { toothFillColors } from '../../styles/teeth'
import { FC } from 'react'

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
    minWidth: '12%'
  }
})

const buttons = [
  {
    value: toothStates.caries,
    label: 'С',
    style: [styles.button, { backgroundColor: '#ffbb44' } as const],
    showSelectedCheck: true,
  },
  {
    value: toothStates.pulpitis,
    label: 'P',
    style: [styles.button, { backgroundColor: toothFillColors.pulpitis.fill } as const],
    showSelectedCheck: true
  },
  {
    value: toothStates.periodontitis,
    label: 'Pt',
    style: [styles.button, { backgroundColor: toothFillColors.periodontitis.fill } as const],
    showSelectedCheck: true
  },
  {
    value: toothStates.root,
    label: 'R',
    style: [styles.button, { borderWidth: 2, borderRightWidth: 2, borderStyle:'dashed', borderColor: toothFillColors.root.stroke } as const],
    showSelectedCheck: true
  },
  {
    value: toothStates.crown,
    label: 'К',
    style: [styles.button, { borderWidth: 2, borderRightWidth: 2, borderColor: toothFillColors.crown.stroke } as const],
    showSelectedCheck: true
  },
  {
    value: toothStates.absent,
    label: 'О',
    style: [styles.button, { borderWidth: 2, borderRightWidth: 2, borderColor: toothFillColors.absent.stroke } as const],
    showSelectedCheck: true
  },
  {
    value: toothStates.artificial,
    label: 'И',
    style: [styles.button, { backgroundColor: toothFillColors.artificial.fill } as const],
    showSelectedCheck: true
   },
]

export type ToothStatePanelProps = {
  toothState: string;
  onValueChange: (newVal: string) => void
}

export const ToothStatePanel: FC<ToothStatePanelProps> = ({ toothState, onValueChange }) => {
  return (
    <SegmentedButtons
      value={toothState}
      onValueChange={onValueChange}
      buttons={buttons}
      style={styles.panel}
    />
  )
}
