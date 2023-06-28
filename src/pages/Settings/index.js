import { Button, List } from 'react-native-paper'
import { TrackingInterval } from './TrackingInterval'
import styles from './styles'
import { TeethColorFill } from './TeethColorFill'
import { ActivityButton } from './ActivityButton'
import { useGeneralControl } from '../../context/general-context/index'
import { Sync } from './Sync'
import { exportPatiensFiles } from '../../db/actions/index'

const Settings = ({ navigation }) => {
  const [actions, dispatch] = useGeneralControl()
  return (
    <List.Section title="Настройки">
      <List.Accordion
        title="Шаблоны сообщений"
        left={props => <List.Icon {...props} icon="format-text" />}
      >
        <List.Item title="Добавить шаблон" onPress={() => navigation.navigate('AddTemplate')} style={styles.button} />
        <List.Item title="Управление шаблонами" onPress={() => navigation.navigate('TemplatesList')} style={styles.button} />
      </List.Accordion>
      <TrackingInterval />
      <TeethColorFill />
      <Sync />
      <ActivityButton />
      <List.Item 
        title="Экспортировать файлы пациентов" 
        onPress={() => {
          dispatch({ type: actions.PROGRESS, payload: { runJob: exportPatiensFiles, mode: 'filesExport' } })
        }}
        style={styles.button} 
      />
      <Button onPress={() => dispatch({ type: actions.ABOUT_INFO })}>О приложении</Button>
    </List.Section>
  )
}

export default Settings
