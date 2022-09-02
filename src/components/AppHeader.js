import { Appbar } from 'react-native-paper'
import { HeaderMenu } from './HeaderMenu'

const AppHeader = ({ navigation, route, options: { menu }, style }) => (
    <Appbar.Header 
      statusBarHeight={1} 
      elevated
    >
      {navigation.canGoBack() && <Appbar.BackAction onPress={navigation.goBack} />}
      <Appbar.Content title={route.name} />
      {menu && <HeaderMenu menu={menu} />}
    </Appbar.Header>
  )

export default AppHeader
