import React from 'react'
import { StyleSheet } from 'react-native'
import { Snackbar, useTheme } from 'react-native-paper'
import { TabsName } from '../../router'

const homeTabs = Object.values(TabsName)

export const Info = ({ 
  __visible, 
  __defaultHandlers, 
  color,
  action,
  text,
  ...rest
}) => {
  const routeName = __defaultHandlers.current.navigation.getCurrentRoute().name
  const __action = action || {
    label: 'Cкрыть',
    onPress: __defaultHandlers.current.clear
  }
  const theme = useTheme()
  
  const colorStyle = {
    backgroundColor: theme.colors[color] || theme.colors.onPrimaryContainer
  }

  const hasTabs = homeTabs.includes(routeName)

  return (
      <Snackbar
        style={[
          styles.container, 
          hasTabs && styles.withMargin, 
          colorStyle
        ]}
        visible={__visible}
        onDismiss={rest.onClose || __defaultHandlers.current.clear}
        action={__action}>
        {text}
      </Snackbar>
  )
}

const styles = StyleSheet.create({
  withMargin: { marginBottom: 70 },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
})
