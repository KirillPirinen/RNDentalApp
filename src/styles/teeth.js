import { StyleSheet } from 'react-native'
import { toothStates } from '../consts'

export const toothFillColors = StyleSheet.create({
  selected: {
    fill: 'red'
  },
  treated: {
    fill: '#9abd57'
  },
  [toothStates.absent]: {
    fill: '#bbbbbb'
  },
  [toothStates.caries]: {
    fill: '#fba404'
  },
  [toothStates.artificial]:{
    fill: '#3dc895'
  },
  [toothStates.pulpitis]: {
    fill: 'grey'
  },
  [toothStates.root]: {
    fill: 'brown'
  },
})
