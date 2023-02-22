import { withSetting } from '../../utils/hoc/withSetting'
import { Counter } from '../../components/Counter'
import { List } from 'react-native-paper';
import styles, { SettingsCheckbox } from './styles'
import { useSettingUpdater } from '../../utils/custom-hooks/useSettingUpdater';

export const TrackingInterval = withSetting('trackingInterval')(({ setting }) => {
  const [values, onChange] = useSettingUpdater(setting)

  return (
    <List.Accordion
        title="Интервал отслеживания записей"
        description="Указывается в днях от текущей даты"
        left={props => <List.Icon {...props} icon="radar" />}>
      <List.Item
        title="Нижняя граница"
        right={() => <Counter
          name="from"
          onChange={onChange}
          initial={values.from}
        />}
        style={styles.button}
      />
      <List.Item
        title="Верхняя граница"
        right={() => <Counter
          name="to"
          onChange={onChange}
          initial={values.to}
        />}
        style={styles.button}
      />
      <SettingsCheckbox 
        title="Неподтвержденные"
        description="Без учета нижней границы"
        name="unconfirmed"
        onChange={onChange}
        initial={values.unconfirmed}
      />
    </List.Accordion>
  )
})
