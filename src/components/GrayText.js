import { Text } from 'react-native'

const defaultStyle = {
  fontWeight: '800',
  color: '#8b979f',
}

const GrayText = ({ children }) => <Text style={defaultStyle}>{children}</Text>

export default GrayText
