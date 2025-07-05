import { withSetting } from '../../utils/hoc/withSetting'
import { SettingsCheckbox } from './styles'
import { useSettingUpdater } from '../../utils/custom-hooks/useSettingUpdater';
import { NamedSetting } from '../../db/models/Settings'
import { t } from '@lingui/core/macro';

export const ActivityButton = withSetting('activityButton')(({ setting }: { setting: NamedSetting<'activityButton'> }) => {
  const [values, onChange] = useSettingUpdater(setting)

  return (
      <SettingsCheckbox 
        title={t`Отображение кнопки действия`}
        description={t`Показывать подсказку при нажатии`}
        name="helperText"
        onChange={onChange}
        value={values.helperText}
      />
  )
})
