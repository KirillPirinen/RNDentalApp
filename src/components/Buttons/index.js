import { TouchableOpacity } from 'react-native'

const defaultStyle = {
  width: 75,
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}

export const SwipeViewButton = ({ style, ...rest }) => <TouchableOpacity {...rest} style={[defaultStyle, style]}/>
