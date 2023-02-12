import { View, ScrollView } from 'react-native'

const defaultStyle = {
  padding: 25,
  flex: 1
}

const Container = ({ children, scroll, ...rest }) => {
  const Component = scroll ? ScrollView : View
  return <Component style={defaultStyle} {...rest}>{children}</Component>
}


export default Container
