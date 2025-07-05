import { withSetting } from '../../utils/hoc/withSetting'
import { List } from 'react-native-paper';
import { SettingsCheckbox } from './styles'
import { useSettingUpdater } from '../../utils/custom-hooks/useSettingUpdater';
import { NamedSetting } from '../../db/models/Settings'
import { t } from '@lingui/core/macro';

export const TeethColorFill = withSetting('teethColorFill')(({ setting }: { setting: NamedSetting<'teethColorFill'> }) => {
  const [values, onChange] = useSettingUpdater(setting)
  return (
    <List.Accordion
        title={t`Отображение зубов в формуле`}
        left={props => <List.Icon {...props} icon="tooth" />}
        style={{ justifyContent: 'space-between' }}
    >
      <SettingsCheckbox 
        title={t`Выделять зубы с историей лечения`}
        description={t`История добавляется при подтверждении лечения`}
        name="history"
        onChange={onChange}
        value={values.history}
      />
      <SettingsCheckbox 
        title={t`Выделять зубы с status localis`}
        name="statusLocalis"
        onChange={onChange}
        value={values.statusLocalis}
      />
    </List.Accordion>
  )
})
