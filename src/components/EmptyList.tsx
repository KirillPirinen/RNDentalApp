import { FC, ReactNode } from 'react'
import { Text, Surface, Avatar } from 'react-native-paper'

export type EmptyListProps = {
  text: string,
  children: ReactNode
}

export const EmptyList: FC<EmptyListProps> = ({ children, text = "Ничего не найдено" }) => (
  <Surface elevation={5} style={{ padding: 12, alignItems:'center', justifyContent:'center' }}>
    <Avatar.Icon size={30} style={{ backgroundColor: 'red', marginBottom: 10 }} icon="exclamation-thick" />
    <Text variant="labelLarge">{text}</Text>
    {children}
  </Surface>
)
