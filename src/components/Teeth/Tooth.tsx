import React, { FC, memo } from 'react'
import { Path, Text, TSpan } from "react-native-svg"
import { toothFillColors } from '../../styles/teeth'

export type ToothProps = {
  paths: Array<string>;
  x: number;
  y: number;
  toothNo: string; 
  onPress?: (toothNo: string) => void;
  selected?: boolean; 
  scale?: number;
  isTreated?: boolean; 
  toothState?: string;
}

export const Tooth: FC<ToothProps> = ({ paths, x, y, toothNo, onPress, selected, scale, isTreated, toothState }) => {
  return (
    <>
      {paths.map((path, index) => <Path scale={scale} onPress={onPress ? () => onPress(toothNo) : undefined} 
        key={index} 
        d={path}
         
        // @ts-ignore
        style={[
          styles.pathStyle, 
          toothState && toothFillColors[toothState],
          isTreated && toothFillColors.treated, 
          selected && toothFillColors.selected,
        ]}
      />)}
      <Text scale={scale}
         
        // @ts-ignore
        xmlSpace="preserve" 
        x={x} 
        y={y} 
        style={styles.labelStyle}
      >
        <TSpan x={x} y={y}>{toothNo}</TSpan>
      </Text>
    </>
  )
}

export default memo(Tooth)

const styles = {
  pathStyle: {
    stroke: "#000",
    strokeWidth: 1,
    strokeLinecap: "round",
    strokeLinejoin: "miter",
    strokeMiterlimit: 4,
    strokeOpacity: 1,
    strokeDasharray: "none",
    fill: "none",
  },
  labelStyle: {
    fontSize: "10.13467216px",
    fontStyle: "normal",
    fontWeight: 400,
    lineHeight: "125%",
    letterSpacing: 0,
    wordSpacing: 0,
    fillOpacity: 1,
    stroke: "none",
    fontFamily: "Sans",
    fill: "#000",
  }
} as const
