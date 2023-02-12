import { StyleSheet } from 'react-native'
import { toothStates } from '../consts'

export const toothFillColors = StyleSheet.create({
  selected: {
    stroke: '#000000',
    fill: 'red',
    strokeDasharray: undefined
  },
  treated: {
    fill: '#9abd57',
    strokeDasharray: undefined,
    stroke: '#000000',
  },
  [toothStates.absent]: {
    stroke: '#bbbbbb'
  },
  [toothStates.caries]: {
    fill: 'url(#caries)'
  },
  [toothStates.artificial]:{
    fill: '#3dc895'
  },
  [toothStates.pulpitis]: {
    fill: '#D99DBC'
  },
  [toothStates.root]: {
    stroke: 'brown',
    strokeDasharray: "1,1.3"
  },
  [toothStates.periodontitis]: {
    fill: '#dd8800'
  },
  [toothStates.crown]: {
    stroke: '#06876a',
    strokeWidth: 1.1
  }
})
