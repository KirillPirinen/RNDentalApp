import { FC, ReactNode } from "react"
import { Text } from "react-native-paper"

const defaultStyle = {
  fontWeight: '800',
  fontSize: 22,
  marginTop: 25,
  marginBottom: 10,
  paddingHorizontal: 20
} as const

const SectionTitle: FC<{ children: ReactNode }> = ({ children }) => <Text style={defaultStyle}>{children}</Text>

export default SectionTitle
