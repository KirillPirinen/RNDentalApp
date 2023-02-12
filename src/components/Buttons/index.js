import React, { Children, cloneElement } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { IconButton, useTheme } from 'react-native-paper'

export const SwipeViewButton = ({ style, ...rest }) => <TouchableOpacity {...rest} style={[styles.swipe, style]}/>

export const ButtonRowPanel = ({ onDelete, onEdit, children, style, buttonsStyle }) => {
  const theme = useTheme()
  return (
  <View style={[styles.actionsWrapper, style]}>
    {Children.map(children, (child) => {
      if(child?.type === IconButton) {
        return cloneElement(child, { 
          size: 30,
          style: [styles.noPadding, buttonsStyle]
        })
      }
      return child
    })}
    {onEdit && <IconButton
        icon="pencil-circle"
        iconColor={theme.colors.backdrop}
        size={30}
        onPress={onEdit}
        style={styles.noPadding}
    />}
    {onDelete && <IconButton
        icon="delete"
        iconColor={theme.colors.error}
        size={30}
        onPress={onDelete}
        style={styles.noPadding}
    />}
  </View>
)}

const styles = StyleSheet.create({
  actionsWrapper: { flexDirection:'row', alignItems: 'center' },
  noPadding: { padding: 0 },
  swipe: {
    width: 75,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
})
