import React from 'react'
import { View } from 'react-native'
import Svg, { Path, Text, TSpan } from "react-native-svg"
import { Teeth } from '../components/Teeth/Teeth'

const styles = {
  fill: "none",
  stroke: "#000",
  strokeWidth: 1,
  strokeLinecap: "round",
  strokeLinejoin: "miter",
  strokeMiterlimit: 4,
  strokeOpacity: 1,
  strokeDasharray: "none",
}

const styles2 = {
  fill: "none",
  stroke: "#000",
  strokeWidth: 1,
  strokeLinecap: "butt",
  strokeLinejoin: "miter",
  strokeMiterlimit: 4,
  strokeOpacity: 1,
  strokeDasharray: "none",
}

const styles3 = {
  fill: "none",
  stroke: "#000",
  strokeWidth: 1,
  strokeLinecap: "butt",
  strokeLinejoin: "round",
  strokeMiterlimit: 4,
  strokeOpacity: 1,
  strokeDasharray: "none",
}

const styles4 = {
  fill: "none",
  stroke: "#000",
  strokeWidth: 1,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeMiterlimit: 4,
  strokeOpacity: 1,
  strokeDasharray: "none",
  markerStart: "none",
  markerMid: "none",
}

const styles5 = {
  fontSize: "10.13467216px",
  fontStyle: "normal",
  fontWeight: 400,
  lineHeight: "125%",
  letterSpacing: 0,
  wordSpacing: 0,
  fill: "#000",
  fillOpacity: 1,
  stroke: "none",
  fontFamily: "Sans",
}

const TeethFormula = ({ appointments, navigation }) => {
  return (
    <View style={{ marginLeft:50 }}>
    <Svg>
    <Teeth />
  </Svg>
    </View>
  )
}

export default TeethFormula
