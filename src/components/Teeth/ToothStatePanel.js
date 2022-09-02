import React, { useState } from 'react'
import { SegmentedButtons } from 'react-native-paper'

export const ToothStatePanel = ({ initalValue }) => {
  const [value, setValue] = useState(initalValue)

  return (
    <SegmentedButtons
     value={value}
     onValueChange={setValue}
     buttons={[
       {
         value: 'walk',
         label: 'Walking',
       },
       {
         value: 'train',
         label: 'Transit',
       },
     ]}
   />
  )
}
