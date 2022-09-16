import React from 'react'
import { List } from 'react-native-paper'

const Settings = ({ navigation }) => {

  return (
    <List.Section title="Настройки">
      <List.Accordion
        title="Шаблоны сообщений"
        left={props => <List.Icon {...props} icon="format-text" />}>
        <List.Item title="Добавить шаблон" onPress={() => navigation.navigate('AddTemplate')}/>
        <List.Item title="Управление шаблонами" onPress={() => navigation.navigate('TemplatesList')} />
      </List.Accordion>
    </List.Section>
  )
}

export default Settings
