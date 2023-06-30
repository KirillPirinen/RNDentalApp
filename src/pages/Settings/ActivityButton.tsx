import { withSetting } from '../../utils/hoc/withSetting'
import { SettingsCheckbox } from './styles'
import { useSettingUpdater } from '../../utils/custom-hooks/useSettingUpdater';
import { NamedSetting } from '../../db/models/Settings'

export const ActivityButton = withSetting('activityButton')(({ setting }: { setting: NamedSetting<'activityButton'> }) => {
  const [values, onChange] = useSettingUpdater(setting)

  return (
      <SettingsCheckbox 
        title="Отображение кнопки действия"
        description="Показывать подсказку при нажатии"
        name="helperText"
        onChange={onChange}
        initial={values.helperText}
      />
  )
})
