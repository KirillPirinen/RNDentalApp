import React from 'react'
import { teethKeysAdult, teethMetaAdult, teethKeysBaby, teethMetaBaby } from './paths-dict'
import { Tooth } from './Tooth'

export const Teeth = () => {
  const withBabyTeeth = true
  return (
    <>
      {teethKeysAdult.map(tooth => <Tooth 
        key={tooth}
        toothNo={tooth}
        paths={teethMetaAdult[tooth].paths}
        x={teethMetaAdult[tooth].x}
        y={teethMetaAdult[tooth].y}
        style={teethMetaAdult[tooth].style}
        textStyle={teethMetaAdult[tooth].textStyle}
      />)}
      {withBabyTeeth && teethKeysBaby.map(tooth => <Tooth 
        key={tooth}
        toothNo={tooth}
        paths={teethMetaBaby[tooth].paths}
        x={teethMetaBaby[tooth].x}
        y={teethMetaBaby[tooth].y}
        style={teethMetaBaby[tooth].style}
        textStyle={teethMetaBaby[tooth].textStyle}
      />)}
    </>
  )
}
