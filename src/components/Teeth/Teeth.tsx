import { memo } from 'react'
import Svg, { Defs, Pattern, Image } from 'react-native-svg'
import { teethKeysAdult, teethMetaAdult, teethKeysBaby, teethMetaBaby } from './paths-dict'
import Tooth, { ToothProps } from './Tooth'
import { Dimensions, View } from 'react-native'
import dots from '../../assets/dots-filled.png'
import { default as ToothModel } from '../../db/models/Tooth'

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
} as const

export type TeethProps<T extends boolean | undefined> = {
  withBabyTeeth?: boolean;
  selectedTooth?: T extends true ? Record<string, boolean> : string;
  onPressTooth?: ToothProps['onPress'], 
  withAdultTeeth?: boolean; 
  scale?: number; 
  teethRecords?: Record<string, ToothModel>,
  containerStyle?: object;
  viewBox?: string;
  multiSelect?: T;
  showStyles?: boolean;
  showTreated?: boolean;
}

export const Teeth = <T extends boolean | undefined>({ 
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
}: TeethProps<T>) => {
  return (
    <View style={containerStyle ? [defaultStyles, containerStyle] : defaultStyles}>
      <Svg
        width="100%" 
        height="100%"
        viewBox={viewBox || defaultViewBox}
        {...rest} 
      >
        <Defs>
          <Pattern id="caries" patternUnits="userSpaceOnUse" width="50" height="50">
            <Image href={dots} x="0" y="0" width="100" height="100" />
          </Pattern>
        </Defs>
        {withAdultTeeth && teethKeysAdult.map(tooth => <Tooth 
          key={tooth}
          toothNo={tooth}
          paths={teethMetaAdult[tooth].paths}
          x={teethMetaAdult[tooth].x}
          y={teethMetaAdult[tooth].y}
          onPress={onPressTooth}
          selected={Boolean(selectedTooth === tooth || multiSelect && selectedTooth && (selectedTooth as Record<string, boolean>)[tooth])}
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
          selected={Boolean(selectedTooth === tooth || multiSelect && selectedTooth && (selectedTooth as Record<string, boolean>)[tooth])}
          scale={scale}
          toothState={showStyles ? teethRecords[tooth]?.toothState : undefined}
          isTreated={showTreated && Boolean(teethRecords[tooth]?.isTreated)}
        />)}
      </Svg>
    </View>
  )
}

export default memo(Teeth)
