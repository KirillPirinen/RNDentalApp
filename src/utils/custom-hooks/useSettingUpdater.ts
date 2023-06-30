import { useRef, useCallback } from 'react'
import debounce from 'lodash.debounce'
import Settings, { NamedSetting } from '../../db/models/Settings'
import { AllowedSettings } from '../../consts'

const debouncedSave = debounce(<T extends NamedSetting<keyof AllowedSettings>>(values: T['value'], setting?: T) => {
  setting?.updateInstance?.(values)
}, 2000)

export const useSettingUpdater = <S extends NamedSetting<keyof AllowedSettings>>(setting: S): [S['value'], (p: { name: keyof S['value'], value: S['value'][keyof S['value']] }) => void] => {
  const values = useRef({...setting.value})

  const cb = ({ name, value }: { name: keyof S['value'], value: S['value'][keyof S['value']] }) => {
    values.current = {...values.current, [name]: value}
    debouncedSave(values.current, setting)
  }
  
  const onChange = useCallback(cb, [setting])

  return [values.current, onChange]

}
