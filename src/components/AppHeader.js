import { Appbar } from 'react-native-paper'

const AppHeader = ({ navigation, route }) => (
    <Appbar.Header statusBarHeight={1}>
      {navigation.canGoBack() && <Appbar.BackAction onPress={navigation.goBack} />}
      <Appbar.Content title={route.name} />
    </Appbar.Header>
  )

export default AppHeader
