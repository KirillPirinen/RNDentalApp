
import { Text } from 'react-native-paper'
import { View, StyleSheet, Linking } from 'react-native'
import { TelegramButton } from '../../../components/Buttons/DeepLinks'
import { Modal } from 'react-native-paper'
import { ContextedPortalDefaultProps } from '..'
import { FC } from 'react'

const text = `Приложение - инструмент для стоматологов, поможет Вам хранить и отслеживать данные пациентов, фото, cнимки, зубную формулу и тд.

Разработано на энтузиазме в свободное время с надеждой что кому-то оно будет полезно.

Со всеми предложениями, выявленными ошибками, благодарностями и тд. можно писать в телеграмм.`

export type AboutInfoProps = ContextedPortalDefaultProps

export const AboutInfo: FC<AboutInfoProps> = ({ 
  __visible, 
  __defaultProps,
}) => {
  return (
    <Modal
      dismissable={true}
      onDismiss={__defaultProps.hide}
      visible={__visible} 
      contentContainerStyle={styles.modal}
    > 
      <View>
        <Text variant="titleLarge">{`О приложении`}</Text>
        <Text variant="bodyLarge" style={styles.marginTop}>
          {text}
        </Text>
        <TelegramButton style={styles.marginTop} onPress={() => Linking.openURL('https://t.me/KirillPirinen')} />
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modal: { backgroundColor: 'white', padding: 20 },
  marginTop: {
    marginTop: 10
  },
})
