import { FC, memo } from 'react'
import { Appbar, IconButton } from 'react-native-paper'
import { StatusBar } from 'react-native'
import { HeaderMenu, HeaderMenuProps } from './HeaderMenu'
import { useModalContent } from '../context/general-context'
import { getStatusBarStyle } from '../utils/getStatusBarStyle'
import { useNavigation, RouteProp } from '@react-navigation/native'
import { useAppTheme } from '../styles/themes'

export type AppHeaderProps = {
  options: { 
    menu: HeaderMenuProps['menu'], 
    headerTitle: string
  },
  route: RouteProp<never>
}

const AppHeader: FC<AppHeaderProps> = ({ options: { menu, headerTitle }, route }) => {
  const navigation = useNavigation()
  const theme = useAppTheme()
  const state = useModalContent()
  const headerColor = theme.colors.primary
  const contentColor = theme.colors.onPrimary
  const isHome = route.name === 'Home'

  const { statusBarColor, statusBarStyle } = getStatusBarStyle({ isHome, isModalOpen: Boolean(state?.__visible), theme })

  return (
    <>
      <StatusBar
        backgroundColor={statusBarColor}
        barStyle={statusBarStyle}
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
        {menu && <HeaderMenu menu={menu} theme={theme} contentColor={contentColor} />}
      </Appbar.Header>
      )}
    </> 
  )
}

export default memo(AppHeader)
