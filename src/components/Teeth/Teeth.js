import { memo } from 'react'
import Svg, { Defs, Pattern, Image } from 'react-native-svg'
import { teethKeysAdult, teethMetaAdult, teethKeysBaby, teethMetaBaby } from './paths-dict'
import Tooth from './Tooth'
import { Dimensions, View } from 'react-native'
import dots from '../../assets/dots-filled.png'

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
  showStyles,
  showTreated,
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
        <Defs>
          <Pattern id="caries" patternUnits="userSpaceOnUse" width="50" height="50">
            <Image href={dots} x="0" y="0" width="100" height="100" fill="#ffdd88" />
          </Pattern>
        </Defs>
        {withAdultTeeth && teethKeysAdult.map(tooth => <Tooth 
          key={tooth}
          toothNo={tooth}
          paths={teethMetaAdult[tooth].paths}
          x={teethMetaAdult[tooth].x}
          y={teethMetaAdult[tooth].y}
          onPress={onPressTooth}
          selected={selectedTooth === tooth || multiSelect && selectedTooth[tooth]}
          scale={scale}
          toothState={showStyles ? teethRecords[tooth]?.toothState : undefined}
          isTreated={showTreated && Boolean(teethRecords[tooth]?.isTreated)}
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

export default memo(Teeth)
