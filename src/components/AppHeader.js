import { Appbar, useTheme, IconButton} from 'react-native-paper'
import { HeaderMenu } from './HeaderMenu'
/* <IconButton 
      icon="arrow-left-box" 
      size={30} /> */
const AppHeader = ({ navigation, options: { menu, headerTitle }, style }) => {
  const theme = useTheme()
  const headerColor = theme.colors.primary
  const contentColor = theme.colors.onPrimary
  return (
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
  )
}

export default AppHeader
