import { Appbar } from 'react-native-paper'

const AppHeader = ({ navigation, route }) => {
  return (
    <Appbar.Header>
      {navigation.canGoBack() && <Appbar.BackAction onPress={navigation.goBack} />}
      <Appbar.Content title={route.name} />
    </Appbar.Header>
  )
}

export default AppHeader
