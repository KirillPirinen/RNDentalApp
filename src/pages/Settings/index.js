import { Button, List } from 'react-native-paper'
import { TrackingInterval } from './TrackingInterval'
import styles from './styles'
import { TeethColorFill } from './TeethColorFill.js'
import { ActivityButton } from './ActivityButton.js'
import { useGeneralControl } from '../../context/general-context/index.js'

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
      <ActivityButton />
      <Button onPress={() => dispatch({ type: actions.ABOUT_INFO })}>О приложении</Button>
    </List.Section>
  )
}

export default Settings
