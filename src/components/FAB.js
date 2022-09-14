import React, { forwardRef, useState, useImperativeHandle, useEffect } from 'react'
import { StyleSheet } from 'react-native'
import AnimatedFAB from './__components__/__FAB'

export const FAB = forwardRef(({ onPress, label, style }, ref) => {
  const [visible, setVisible] = useState(true)
  const [expanded, setExpanded] = useState(false)

  useImperativeHandle(ref, () => setVisible)

  useEffect(() => {
    if(!visible) {
      setExpanded(false)
    }
  }, [visible])

  const __onPress = () => {
    setExpanded(true)
  }

  return (
      <AnimatedFAB
        icon={expanded ? 'plus': 'arrow-expand-left'}
        label={label}
        extended={expanded}
        onPress={expanded ? onPress : __onPress}
        onLongPress={() => setExpanded(false)}
        visible={visible}
        animateFrom={'right'}
        iconMode={'dynamic'}
        style={[styles.fabStyle, style]}
      />
  )
})

const styles = StyleSheet.create({
  fabStyle: {
    bottom: 16,
    right: 16,
  },
});