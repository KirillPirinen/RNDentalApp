import { FC, ReactNode } from 'react'
import { Text } from 'react-native'

const defaultStyle = {
  fontWeight: '800',
  color: '#8b979f',
} as const

const GrayText: FC<{ children: ReactNode }> = ({ children }) => <Text style={defaultStyle}>{children}</Text>

export default GrayText
