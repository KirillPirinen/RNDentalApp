import { useRef, useCallback } from 'react'
import debounce from 'lodash.debounce'

const debouncedSave = debounce((setting, values) => {
  setting?.updateInstance?.(values)
}, 2000)

export const useSettingUpdater = (setting) => {
  const values = useRef({...setting.value})

  const onChange = useCallback(({ name, value }) => {
    values.current = {...values.current, [name]: value}
    debouncedSave(setting, values.current)
  }, [setting])

  return [values.current, onChange]

}
