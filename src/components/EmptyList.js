import { Text, Surface, Avatar } from 'react-native-paper'

export const EmptyList = ({ children, text = "Ничего не найдено" }) => (
  <Surface elevation={5} style={{ padding: 12, alignItems:'center', justifyContent:'center' }}>
    <Avatar.Icon size={30} style={{ backgroundColor: 'red', marginBottom: 10 }} icon="exclamation-thick" />
    <Text variant="labelLarge">{text}</Text>
    {children}
  </Surface>
)
