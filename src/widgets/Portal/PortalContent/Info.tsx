import React, { FC } from 'react'
import { StyleSheet, ViewStyle } from 'react-native'
import { Snackbar, SnackbarProps } from 'react-native-paper'
import { TabsName } from '../../../router'
import { ContextedPortalDefaultProps } from '..'
import { AppThemeColors, useAppTheme } from '../../../styles/themes'
import { t } from '@lingui/core/macro'

const homeTabs = Object.values(TabsName)

export type InfoProps = Partial<Omit<SnackbarProps, 'visible' | 'onDismiss'>> & ContextedPortalDefaultProps<{
  color?: AppThemeColors;
  text: string;
  action?: SnackbarProps['action'];
  onClose?: () => void;
}>

export const Info: FC<InfoProps> = ({ 
  __visible, 
  __defaultProps, 
  color,
  action,
  text,
  onClose,
  ...rest
}) => {
   
  // @ts-ignore
  const routeName = __defaultProps.navigation.getCurrentRoute().name

  const theme = useAppTheme()
  
  const colorStyle = {
    backgroundColor: (color && theme.colors[color]) || theme.colors.primaryContainer
  } as ViewStyle

  const hasTabs = homeTabs.includes(routeName)

  return (
      <Snackbar
        style={[
          styles.container, 
          hasTabs && styles.withMargin, 
          colorStyle
        ]}
        visible={__visible}
        onDismiss={onClose || __defaultProps.clear}
        action={action || { label: t`Cкрыть`, onPress: __defaultProps.clear }}
        {...rest}
      >
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
