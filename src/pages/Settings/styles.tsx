import { useCallback, useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { List, ListItemProps } from 'react-native-paper'

export type SettingsCheckboxProps<N extends string = string> = ListItemProps & {
  name?: N;
  initial?: boolean;
  radio?: boolean;
  value?: boolean;
}

type SimpleCB<T = boolean> = {
  onChange: (val: T) => undefined | boolean | null | Promise<undefined | boolean | null>
}

type ComplexCB<T = boolean, N extends string = string> = {
  onChange: (val: { name: N, value: T }) => undefined | boolean | null | Promise<undefined | boolean | null>
}

export const SettingsCheckbox = <T extends SettingsCheckboxProps, N extends string>(
  { onChange, name, initial, radio, value, style, ...rest }: SettingsCheckboxProps<N> & (T['name'] extends undefined ? SimpleCB : ComplexCB<boolean, N>)
) => {
  const [_checked, setChecked] = useState(initial)

  useEffect(() => {
    value !== _checked && setChecked(value)
  }, [value])

  const iconBlank = radio ? 'checkbox-blank-circle-outline' : 'checkbox-blank-outline'
  const iconChecked = radio ? 'checkbox-marked-circle' : 'checkbox-marked'
  return (
    <List.Item
      onPress={async () => {
        const newValue = !_checked
        if(!radio || (newValue && radio)) {
          let result: ReturnType<typeof onChange>
          if (name) {
            result = (onChange as ComplexCB<boolean, N>['onChange'])({ name, value: newValue })
          } else {
            result = (onChange as SimpleCB['onChange'])(newValue)
          }
          
          if (result instanceof Promise) {
            const awaited = await result
            awaited && setChecked(newValue)
            return awaited
          }
    
          result && setChecked(newValue)
    
          return result
        }
      }}
      right={() => <List.Icon style={styles.checkbox} icon={_checked ? iconChecked : iconBlank}/>}
      style={styles.button}
      {...rest}
    />
  )
}

export type SettingsRadioGroupProps<N extends string = string> = {
  group: Array<{ name: string, title: string } & Omit<SettingsCheckboxProps, 'radio' | 'value' | 'onChange'>>
  initial?: string;
  name?: N;
}

export const SettingsRadioGroup = <T extends SettingsRadioGroupProps, N extends string>({ 
  onChange, 
  name, 
  group,
  initial 
}: SettingsRadioGroupProps<N> & (T['name'] extends string ? SimpleCB<string> : ComplexCB<string, N>)) => {
  const [value, setValue] = useState(initial)

  const handleChange = useCallback<ComplexCB<boolean, string>['onChange']>(async ({ name: newValue, value }) => {
    if (value) {
      let result: ReturnType<typeof onChange>

      if (name) {
        result = (onChange as ComplexCB<string, N>['onChange'])({ name, value: newValue })
      } else {
        result = (onChange as SimpleCB<string>['onChange'])(newValue)
      }

      if (result instanceof Promise) {
        const awaited = await result
        awaited && setValue(newValue)
        return awaited
      }

      result && setValue(newValue)

      return result
    }
  }, [onChange, setValue, name])

  return (
    <>
      {group?.map(radio => {
        return (
          <SettingsCheckbox 
            key={radio.name}
            value={value === radio.name} 
            onChange={handleChange}
            {...radio}
            radio
          />
        )
      })}
    </>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingLeft: 22,
    paddingRight: 16,
  },
  checkbox: {
    paddingRight: 16
  },
  noAccordionItem: {
    paddingLeft: 8,
  },
  noAccordionItemTitle: {
    paddingLeft: 0
  }
})

export default styles
