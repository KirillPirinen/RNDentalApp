import React from 'react'
import { Path, Text, TSpan } from "react-native-svg"

export const Tooth = ({ paths, x, y, style, textStyle, toothNo }) => {
  return (
    <>
      {paths.map((path, index) => <Path key={index} d={path} style={style} />)}
      <Text xmlSpace="preserve" x={x} y={y} style={textStyle}>
        <TSpan x={x} y={y}>{toothNo}</TSpan>
      </Text>
    </>
  )
}
