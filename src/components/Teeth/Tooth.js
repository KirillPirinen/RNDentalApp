import React, { memo } from 'react'
import { Path, Text, TSpan } from "react-native-svg"
import { StyleSheet } from 'react-native'

export const Tooth = ({ paths, x, y, toothNo, onPress, selected, scale }) => {
  return (
    <>
      {paths.map((path, index) => <Path scale={scale} onPress={onPress(toothNo)} 
        key={index} 
        d={path} 
        style={[styles.pathStyle, selected && styles.selected]} 
      />)}
      <Text scale={scale} xmlSpace="preserve" x={x} y={y} style={styles.labelStyle}>
        <TSpan x={x} y={y}>{toothNo}</TSpan>
      </Text>
    </>
  )
}

export default memo(Tooth)

const styles = StyleSheet.create({
  selected: {
    fill:'red'
  },
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
})
