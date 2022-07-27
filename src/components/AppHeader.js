import { Appbar } from 'react-native-paper'

const AppHeader = ({ navigation, back, route }) => {
  return (
    <Appbar.Header>
      {back && <Appbar.BackAction onPress={navigation.goBack} />}
      <Appbar.Content title={route.name} />
    </Appbar.Header>
  )
}

export default AppHeader
