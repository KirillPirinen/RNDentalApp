import React, { Children, FC, ReactNode, cloneElement } from 'react'
import { StyleSheet, TouchableOpacity, TouchableOpacityProps, View, ViewStyle } from 'react-native'
import { IconButton } from 'react-native-paper'
import { useAppTheme } from '../../styles/themes'

export type SwipeViewButtonProps = TouchableOpacityProps & {
  style?: ViewStyle
}

export const SwipeViewButton: FC<SwipeViewButtonProps> = ({ style, ...rest }) => <TouchableOpacity {...rest} style={style ? [styles.swipe, style]: styles.swipe}/>

export type ButtonRowPanelProps = {
  onDelete: () => void;
  onEdit: () => void;
  children?: ReactNode;
  style?: ViewStyle;
  buttonsStyle?: ViewStyle;
}

export const ButtonRowPanel: FC<ButtonRowPanelProps> = ({ onDelete, onEdit, children, style, buttonsStyle }) => {
  const theme = useAppTheme()
  return (
  <View style={[styles.actionsWrapper, style]}>
    {Children.map(children, (child) => {
       
      // @ts-ignore
      if(child?.type === IconButton) {
         
        // @ts-ignore
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
