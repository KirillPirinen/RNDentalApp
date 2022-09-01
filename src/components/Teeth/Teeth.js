import React from 'react'
import Svg, {} from 'react-native-svg'
import { teethKeysAdult, teethMetaAdult, teethKeysBaby, teethMetaBaby } from './paths-dict'
import Tooth from './Tooth'
import withObservables from '@nozbe/with-observables'

export const Teeth = ({ withBabyTeeth, selectedTooth, pressHandler, withAdultTeeth, scale, ...rest }) => (
    <Svg {...rest}>
      {withAdultTeeth && teethKeysAdult.map(tooth => <Tooth 
        key={tooth}
        toothNo={tooth}
        paths={teethMetaAdult[tooth].paths}
        x={teethMetaAdult[tooth].x}
        y={teethMetaAdult[tooth].y}
        onPress={pressHandler}
        selected={selectedTooth === tooth}
        scale={scale}
      />)}
      {withBabyTeeth && teethKeysBaby.map(tooth => <Tooth 
        key={tooth}
        toothNo={tooth}
        paths={teethMetaBaby[tooth].paths}
        x={teethMetaBaby[tooth].x}
        y={teethMetaBaby[tooth].y}
        onPress={pressHandler}
        selected={selectedTooth === tooth}
        scale={scale}
      />)}
    </Svg>
)
