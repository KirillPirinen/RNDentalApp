import { View } from 'react-native'

const defaultStyle = {
  padding: 25,
  flex: 1
}

const Container = ({ children }) => <View style={defaultStyle}>{children}</View>


export default Container
