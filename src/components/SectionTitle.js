import { Text } from "react-native"

const defaultStyle = {
  fontWeight: '800',
  fontSize: 22,
  color: '#000000',
  marginTop: 25,
  marginBottom: 10,
  paddingHorizontal: 20
}

const SectionTitle = ({ children }) => <Text style={defaultStyle}>{children}</Text>

export default SectionTitle
