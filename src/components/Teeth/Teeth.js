import React from 'react'
import Svg from 'react-native-svg'
import { teethKeysAdult, teethMetaAdult, teethKeysBaby, teethMetaBaby } from './paths-dict'
import Tooth from './Tooth'
import { Dimensions, View } from 'react-native'

const originalWidth = 289
const originalHeight = 370
const width = Dimensions.get("window").width
const defaultViewBox = `0 0 ${originalWidth} ${originalHeight}`
const defaultStyles = { 
  width, 
  aspectRatio: originalWidth / originalHeight, 
  backgroundColor:'white',
  borderBottomWidth: 1,
  position:'relative'
}

export const Teeth = ({ 
  withBabyTeeth, 
  selectedTooth, 
  onPressTooth, 
  withAdultTeeth, 
  scale, 
  teethRecords = {},
  containerStyle,
  viewBox,
  multiSelect,
  ...rest 
}) => {
  return (
    <View style={[defaultStyles, containerStyle]}>
      <Svg
        width="100%" 
        height="100%"
        viewBox={viewBox || defaultViewBox}
        {...rest} 
      >
        {withAdultTeeth && teethKeysAdult.map(tooth => <Tooth 
          key={tooth}
          toothNo={tooth}
          paths={teethMetaAdult[tooth].paths}
          x={teethMetaAdult[tooth].x}
          y={teethMetaAdult[tooth].y}
          onPress={onPressTooth}
          selected={selectedTooth === tooth || multiSelect && selectedTooth[tooth]}
          scale={scale}
          record={teethRecords[tooth]}
        />)}
        {withBabyTeeth && teethKeysBaby.map(tooth => <Tooth 
          key={tooth}
          toothNo={tooth}
          paths={teethMetaBaby[tooth].paths}
          x={teethMetaBaby[tooth].x}
          y={teethMetaBaby[tooth].y}
          onPress={onPressTooth}
          selected={selectedTooth === tooth || multiSelect && selectedTooth[tooth]}
          scale={scale}
          record={teethRecords[tooth]}
        />)}
      </Svg>
    </View>
  )
}
