import { StyleSheet } from 'react-native'
import { List } from 'react-native-paper'
import { TrackingInterval } from './TrackingInterval'
import styles from './styles'

const Settings = ({ navigation }) => {
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
    </List.Section>
  )
}

export default Settings