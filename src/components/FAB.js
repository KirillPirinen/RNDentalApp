import { forwardRef, useState, useImperativeHandle, useEffect } from 'react'
import { StyleSheet } from 'react-native'
import { AnimatedFAB } from 'react-native-paper'
import { useSettings } from '../context/general-context/index.js'

export const FAB = forwardRef(({ onPress, label, style }, ref) => {
  const [visible, setVisible] = useState(true)
  const [expanded, setExpanded] = useState(false)
  const { activityButton } = useSettings()

  const expandable = activityButton.helperText

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
        icon={!expandable || expanded ? 'plus': 'arrow-expand-left'}
        label={expanded ? label : ''}
        extended={expandable && expanded}
        onPress={!expandable || expanded ? onPress : __onPress}
        onLongPress={expandable ? () => setExpanded(false) : undefined}
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
