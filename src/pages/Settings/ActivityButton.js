import { withSetting } from '../../utils/hoc/withSetting'
import { SettingsCheckbox } from './styles'
import { useSettingUpdater } from '../../utils/custom-hooks/useSettingUpdater';

export const ActivityButton = withSetting('activityButton')(({ setting }) => {
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
