import React, { memo } from 'react'
import { Appbar, useTheme, IconButton } from 'react-native-paper'
import { StatusBar } from 'react-native'
import { HeaderMenu } from './HeaderMenu'
import { useModalContent } from '../context/modal-context'
import { getStatusBarStyle } from '../utils/getStatusBarStyle'

const AppHeader = ({ navigation, options: { menu, headerTitle }, route, style }) => {

  const theme = useTheme()
  const state = useModalContent()
  const headerColor = theme.colors.primary
  const contentColor = theme.colors.onPrimary
  const isHome = route.name === 'Home'

  const { statusBarColor, statuBarStyle } = getStatusBarStyle({ isHome, isModalOpen: state?.__visible, theme })

  return (
    <>
      <StatusBar
        backgroundColor={statusBarColor}
        barStyle={statuBarStyle}
        animated
      />
      {!isHome && (
        <Appbar.Header
        statusBarHeight={1}
        style={{ backgroundColor: headerColor }}
        elevated
      >
        {navigation.canGoBack() && <IconButton
          onPress={navigation.goBack}
          icon="arrow-left-circle" 
          size={36}
          iconColor={contentColor}
        />}
        <Appbar.Content 
          title={headerTitle} 
          titleStyle={{ color: contentColor }} 
        />
        {menu && <HeaderMenu 
          menu={menu} 
          theme={theme} 
          headerColor={headerColor}
          contentColor={contentColor} 
        />}
      </Appbar.Header>
      )}
    </> 
  )
}

export default memo(AppHeader)
