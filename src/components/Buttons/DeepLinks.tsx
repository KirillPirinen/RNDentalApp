import { View, ViewStyle } from 'react-native'
import { Foundation, FontAwesome5, Fontisto } from '@expo/vector-icons'
import Button from '../Button'
import { FC } from 'react'

const styles = { marginLeft: 10, width: 45 }

type ButtonProps = {
  onPress: () => void
  style?: ViewStyle
}

export const CallButton: FC<ButtonProps> = ({ onPress }) => (
  <View style={styles}>
    <Button color="#84D269" onPress={onPress}>
      <Foundation name="telephone" size={24} color="white" />
    </Button>
  </View>
)

export const WhatsappButton: FC<ButtonProps>  = ({ onPress }) => (
  <View style={styles}>
    <Button color="#43d854" onPress={onPress}>
      <Fontisto name="whatsapp" size={24} color="white" />
    </Button>
  </View>
)

export const TelegramButton: FC<ButtonProps> = ({ onPress, style }) => (
  <View style={[styles, style]}>
    <Button color="#0088cc" onPress={onPress}>
      <FontAwesome5 name="telegram-plane" size={24} color="white" />
    </Button>
  </View>
)
