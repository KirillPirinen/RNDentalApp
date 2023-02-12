import { StyleSheet } from 'react-native'
import { List } from 'react-native-paper'

const Settings = ({ navigation }) => {
  return (
    <List.Section title="Настройки">
      <List.Accordion
        title="Шаблоны сообщений"
        left={props => <List.Icon {...props} icon="format-text" />} style={styles.section}>
        <List.Item title="Добавить шаблон" onPress={() => navigation.navigate('AddTemplate')}/>
        <List.Item title="Управление шаблонами" onPress={() => navigation.navigate('TemplatesList')} />
      </List.Accordion>
    </List.Section>
  )
}

export default Settings


const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 15
  }
})
