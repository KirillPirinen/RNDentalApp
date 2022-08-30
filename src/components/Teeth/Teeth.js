import React from 'react'
import { teethKeys, teethMeta } from './paths-dict'
import { Tooth } from './Tooth'

export const Teeth = () => {
  return teethKeys.map(tooth => <Tooth 
    key={tooth}
    toothNo={tooth}
    paths={teethMeta[tooth].paths}
    x={teethMeta[tooth].x}
    y={teethMeta[tooth].y}
    style={teethMeta[tooth].style}
    textStyle={teethMeta[tooth].textStyle}
  />)
}
