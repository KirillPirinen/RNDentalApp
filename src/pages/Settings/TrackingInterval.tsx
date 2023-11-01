import { withSetting } from '../../utils/hoc/withSetting'
import { Counter } from '../../components/Counter'
import { List } from 'react-native-paper';
import styles, { SettingsCheckbox } from './styles'
import { useSettingUpdater } from '../../utils/custom-hooks/useSettingUpdater';
import { NamedSetting } from '../../db/models/Settings'
import { t } from '@lingui/macro';

export const TrackingInterval = withSetting('trackingInterval')(({ setting }: { setting: NamedSetting<'trackingInterval'> }) => {
  const [values, onChange] = useSettingUpdater(setting)

  return (
    <List.Accordion
        title={t`Интервал отслеживания записей`}
        description={t`Указывается в днях от текущей даты`}
        left={props => <List.Icon {...props} icon="radar" />}>
      <List.Item
        title={t`Нижняя граница`}
        right={() => <Counter
          name="from"
          onChange={onChange}
          initial={values.from}
        />}
        style={styles.button}
      />
      <List.Item
        title={t`Верхняя граница`}
        right={() => <Counter
          name="to"
          onChange={onChange}
          initial={values.to}
        />}
        style={styles.button}
      />
      <SettingsCheckbox 
        title={t`Неподтвержденные`}
        description={t`Без учета нижней границы`}
        name="unconfirmed"
        onChange={onChange}
        initial={values.unconfirmed}
      />
    </List.Accordion>
  )
})
