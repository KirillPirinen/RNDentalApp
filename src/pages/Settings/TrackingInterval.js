import { View } from 'react-native'
import { withSetting } from '../../utils/hoc/withSetting'
import { useRef, useCallback, useEffect } from 'react'
import { Counter } from '../../components/Counter'
import { DEFAULT_SETTINGS } from '../../consts'
import debounce from 'lodash.debounce'
import { List } from 'react-native-paper';
import styles, { SettingsCheckbox } from './styles'

const debouncedSave = debounce((setting, values) => {
  setting?.updateInstance(values)
}, 2000)

export const TrackingInterval = withSetting('trackingInterval')(({ setting }) => {
  const values = useRef({...setting.value})

  const onChange = useCallback(({ name, value }) => {
    values.current = {...values.current, [name]: value}
    debouncedSave(setting, values.current)
  }, [setting])

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
          initial={values.current.from || DEFAULT_SETTINGS.trackingInterval.from}
        />}
        style={styles.button}
      />
      <List.Item
        title="Верхняя граница"
        right={() => <Counter
          name="to"
          onChange={onChange}
          initial={values.current.to || DEFAULT_SETTINGS.trackingInterval.to}
        />}
        style={styles.button}
      />
      <SettingsCheckbox 
        title="Неподтвержденные"
        description="Без учета нижней границы"
        name="unconfirmed"
        onChange={onChange}
        initial={values.current.unconfirmed || DEFAULT_SETTINGS.trackingInterval.unconfirmed}
      />
    </List.Accordion>
  )
})
