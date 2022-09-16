import { Appbar, useTheme } from 'react-native-paper'
import { HeaderMenu } from './HeaderMenu'

const AppHeader = ({ navigation, options: { menu, headerTitle }, style }) => {
  const theme = useTheme()
  const headerColor = theme.colors.elevation.level3
  return (
    <Appbar.Header
      statusBarHeight={1}
      style={{ backgroundColor: headerColor }}
      elevated
    >
      {navigation.canGoBack() && <Appbar.BackAction onPress={navigation.goBack} />}
      <Appbar.Content title={headerTitle} />
      {menu && <HeaderMenu menu={menu} theme={theme} headerColor={headerColor} />}
    </Appbar.Header>
  )
}

export default AppHeader
