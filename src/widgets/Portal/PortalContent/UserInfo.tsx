
import { Button, Text } from 'react-native-paper'
import { StyleSheet, Linking, ScrollView } from 'react-native'
import { TelegramButton } from '../../../components/Buttons/DeepLinks'
import { Modal } from 'react-native-paper'
import { ContextedPortalDefaultProps } from '..'
import { FC } from 'react'

export type UserInfoProps =  ContextedPortalDefaultProps<{
  mode: 'about' | 'migrate';
  onOk?: () => void;
}>

const styles = StyleSheet.create({
  modal: { backgroundColor: 'white', padding: 20 },
  marginTop: {
    marginTop: 10
  },
})


const content: Record<UserInfoProps['mode'], JSX.Element> = {
  about: (
    <>
      <Text variant="titleLarge">{`О приложении`}</Text>
      <Text variant="bodyLarge" style={styles.marginTop}>
        {`Приложение - инструмент для стоматологов, поможет Вам хранить и отслеживать данные пациентов, фото, cнимки, зубную формулу и тд.

Разработано на энтузиазме в свободное время с надеждой что кому-то оно будет полезно.

Со всеми предложениями, выявленными ошибками, благодарностями и тд. можно писать в телеграмм.`}
      </Text>
      <TelegramButton style={styles.marginTop} onPress={() => Linking.openURL('https://t.me/KirillPirinen')} />
    </>
  ),
  migrate: (
    <>
      <Text variant="titleLarge">{`О миграции данных`}</Text>
      <Text variant="bodyLarge" style={styles.marginTop}>
        {`Для переноса данных на другой телефон нужно действовать в несколько этапов:
        1) В списке БД выбрать желаемую и нажать "Экспортировать" - после этого выбрать папку куда сохранить БД.
         - В выбранной папке будут создано два файла с расширенями .db и .db-wal
        2) На новом устройстве установить приложение. Зайти в настройки -> БД -> Импортировать новую БД - после этого нужно выбрать 2 файла созданных на первом этапе.
        3) После успешного импорта в списке БД выбрать нужную и "Монтировать".
         - Приложение перезагрузится и БД будет смонтирована на устройстве.
        4*) На старом устройстве в настройках нажать "Экспортировать файлы пациентов" и выбрать папку куда сохранить.
         - В выбранной папке будут все файлы сохраненные в приложении и служебный файл manifest.json
        5*) Перенести папку с данными и служебным файлом на новое устройство. В настройках выбрать пункт "Импортировать файлы пациентов" и указать перенесенную папку.

        * шаги опциональные - если необходим перенос файлов пациентов

        `}
        <Text theme={{ colors: { onSurface: 'red' }}}>Важно: последовательность шагов важна при импорте новых файлов. (сначала импорт и монтирование БД, потом файлы). </Text>
      </Text>
    </>
  )
}

export const UserInfo: FC<UserInfoProps> = ({ 
  __visible, 
  __defaultProps,
  mode,
  onOk
}) => {
  const onDismiss = () => {
    __defaultProps.clear()
    onOk?.()
  }
  return (
    <Modal
      dismissable={true}
      onDismiss={onDismiss}
      visible={__visible} 
      contentContainerStyle={styles.modal}
    > 
      <ScrollView style={{ maxHeight: '100%'}}>
          {content[mode]}
          <Button
            mode="contained-tonal"
            icon="hand-okay"
            textColor="white"
            onPress={onDismiss}
            style={styles.marginTop}
          > 
            OK
          </Button>
      </ScrollView>
    </Modal>
  )
}
