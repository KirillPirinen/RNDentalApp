import React, { useState } from 'react'
import { Text, ToggleButton } from 'react-native-paper'

export const ToothStatePanel = ({ initalValue }) => {
  const [value, setValue] = useState(initalValue)

  return (
    <ToggleButton.Row onValueChange={value => setValue(value)} value={value}>
      <ToggleButton
        icon={require('../../../assets/icon.png')}
      />
      <ToggleButton icon="format-align-right" value="R" />
      <ToggleButton icon="format-align-right" value="C" />
      <ToggleButton icon="format-align-right" value="P" />
      <ToggleButton icon="format-align-right" value="Pt" />
      <ToggleButton icon="format-align-right" value="П" />
      <ToggleButton icon="format-align-right" value="К" />
      <ToggleButton icon="format-align-right" value="И" />
    </ToggleButton.Row>
  )
}
