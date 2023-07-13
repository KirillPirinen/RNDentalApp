import { withSetting } from '../../utils/hoc/withSetting'
import { SettingsRadioGroup } from './styles'
import { useSettingUpdater } from '../../utils/custom-hooks/useSettingUpdater';
import { CONTACT_SYNC_STRATEGY } from '../../consts';
import { List } from 'react-native-paper';
import { NamedSetting } from '../../db/models/Settings'

export const Sync = withSetting('sync')(({ setting }: { setting: NamedSetting<'sync'> }) => {
  const [values, onChange] = useSettingUpdater(setting)

  return (
    <List.Accordion
        title="Синхронизация с контактами"
        description="Обновлять при изменении контакта"
        left={props => <List.Icon {...props} icon="sync" />}
    >
      <SettingsRadioGroup
        group={[
          { name: CONTACT_SYNC_STRATEGY.ask, title: 'Всегда спрашивать' },
          { name: CONTACT_SYNC_STRATEGY.always, title: 'Автоматически' },
          { name: CONTACT_SYNC_STRATEGY.never, title: 'Никогда' }
        ]}
        name="contactStrategyType"
        onChange={onChange}
        initial={values.contactStrategyType}
      />
    </List.Accordion>
  )
})
