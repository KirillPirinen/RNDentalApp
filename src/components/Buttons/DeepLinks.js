import { View } from 'react-native'
import { Foundation, FontAwesome5, Fontisto } from '@expo/vector-icons'
import Button from '../Button'

const styles = { marginLeft: 10, width: 45 }

export const CallButton = ({ onPress }) => (
  <View style={styles}>
    <Button color="#84D269" onPress={onPress}>
      <Foundation name="telephone" size={24} color="white" />
    </Button>
  </View>
)

export const WhatsappButton = ({ onPress }) => (
  <View style={styles}>
    <Button color="#43d854" onPress={onPress}>
      <Fontisto name="whatsapp" size={24} color="white" />
    </Button>
  </View>
)

export const TelegramButton = ({ onPress, style }) => (
  <View style={[styles, style]}>
    <Button color="#0088cc" onPress={onPress}>
      <FontAwesome5 name="telegram-plane" size={24} color="white" />
    </Button>
  </View>
)
