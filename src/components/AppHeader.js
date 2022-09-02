import { Appbar, useTheme } from 'react-native-paper'
import { HeaderMenu } from './HeaderMenu'

const AppHeader = ({ navigation, route, options: { menu }, style }) => {
  const theme = useTheme()
  return (
    <Appbar.Header 
      statusBarHeight={1}
      style={{ backgroundColor: theme.colors.elevation.level3 }}
      elevated
    >
      {navigation.canGoBack() && <Appbar.BackAction onPress={navigation.goBack} />}
      <Appbar.Content title={route.name} />
      {menu && <HeaderMenu menu={menu} theme={theme} />}
    </Appbar.Header>
  )
}

export default AppHeader
