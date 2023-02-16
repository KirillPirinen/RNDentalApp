import { withSetting } from '../../utils/hoc/withSetting'
import { List } from 'react-native-paper';
import { SettingsCheckbox } from './styles'
import { useSettingUpdater } from '../../utils/custom-hooks/useSettingUpdater';

export const TeethColorFill = withSetting('teethColorFill')(({ setting }) => {
  const [values, onChange] = useSettingUpdater(setting)

  return (
    <List.Accordion
        title="Отображение зубов в формуле"
        left={props => <List.Icon {...props} icon="tooth" />}
    >
      <SettingsCheckbox 
        title="Выделять зубы с историей лечения"
        description="История добавляется при подтверждении лечения"
        name="history"
        onChange={onChange}
        initial={values.history}
      />
      <SettingsCheckbox 
        title="Выделять зубы с status localis"
        name="statusLocalis"
        onChange={onChange}
        initial={values.statusLocalis}
      />
    </List.Accordion>
  )
})
