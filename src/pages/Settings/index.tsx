import { Button, List, Text } from 'react-native-paper'
import { TrackingInterval } from './TrackingInterval'
import styles from './styles'
import { TeethColorFill } from './TeethColorFill'
import { ActivityButton } from './ActivityButton'
import { useGeneralControl } from '../../context/general-context/index'
import { Sync } from './Sync'
import { exportPatiensFiles, importPatiensFiles } from '../../db/actions/index'
import { NavigationProp } from '@react-navigation/native'
import { FC } from 'react'
import { widthUnmounOnBlur } from '../../utils/hoc/widthUnmounOnBlur'
import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import { Lang } from './Lang'
import { ScrollView } from 'react-native'

export type SettingsProps = {
  navigation: NavigationProp<ReactNavigation.RootParamList>
}

const Settings: FC<SettingsProps> = ({ navigation }) => {
  const [actions, dispatch] = useGeneralControl()
  return (
    <ScrollView>
      <List.Section title={t`Настройки`}>
        <List.Item 
          title={() => <Text style={{ marginLeft: -8 }} variant="bodyLarge"><Trans>Базы данных</Trans></Text>} 
          onPress={() => navigation.navigate('DatabasesList')}
          left={props => <List.Icon {...props} icon="database" style={styles.noAccordionItem} />}
        />
        <Lang />
        <List.Accordion
          title={t`Шаблоны сообщений`}
          left={props => <List.Icon {...props} icon="format-text" />}
        >
          <List.Item title={t`Добавить шаблон`} onPress={() => navigation.navigate('AddTemplate')} style={styles.button} />
          <List.Item title={t`Управление шаблонами`} onPress={() => navigation.navigate('TemplatesList')} style={styles.button} />
        </List.Accordion>
        <TrackingInterval />
        <TeethColorFill />
        <Sync />
        <ActivityButton />
        <List.Item
          title={t`Экспортировать файлы пациентов`}
          onPress={() => {
            dispatch({ type: actions.PROGRESS, payload: { runJob: exportPatiensFiles, mode: 'filesExport' } })
          }}
          style={styles.button} 
        />
        <List.Item 
          title={t`Импортировать файлы пациентов`}
          onPress={() => {
            dispatch({ type: actions.PROGRESS, payload: { runJob: importPatiensFiles, mode: 'filesExport' } })
          }}
          style={styles.button}
        />
        <Button onPress={() => dispatch({ 
          type: actions.USER_INFO, 
          payload: {
            mode: 'about'
          }
        })}>
          <Trans>О приложении</Trans>
        </Button>
      </List.Section>
    </ScrollView>
  )
}

export default widthUnmounOnBlur(Settings)
