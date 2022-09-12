import React from 'react'
import { StyleSheet } from 'react-native'
import { Snackbar, useTheme } from 'react-native-paper'

const levels = {
  error: 'error', //onErrorContainer //error //errorContainer
  info: 'onPrimary' //onPrimaryContainer //onSecondary
}

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

  return (
      <Snackbar
        style={[
          styles.container, 
          routeName === 'Home' && styles.withMargin, 
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
