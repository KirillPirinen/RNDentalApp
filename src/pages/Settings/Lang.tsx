import { SettingsRadioGroup } from './styles'
import { List } from 'react-native-paper';
import { t } from '@lingui/core/macro';
import { AppLocales, appConfigSync } from '../../consts/config';
import AsyncStorage from '@react-native-async-storage/async-storage'
import RNRestart from 'react-native-restart'
import { useGeneralControl } from '../../context/general-context';
import { useCallback } from 'react';

const localVariants: { name: AppLocales, title: string }[] = [
  { name: 'en', title: 'English' },
  { name: 'ru', title: 'Русский' },
  { name: 'es', title: 'Español' },
  { name: 'zh', title: `中文（普通话）` },
  { name: 'fr', title: 'Français' },
  { name: 'de', title: 'Deutsch' },
  { name: 'hi', title: 'हिंदी' }
]

const onLangChange = async (value: AppLocales, withRestart?: boolean) => {
  await AsyncStorage.setItem('lang', value)
  withRestart && RNRestart.restart()
}

export const Lang = () => {
  const [actions, dispatch] = useGeneralControl()

  const onChange = useCallback(({ value }: { value: string }) => {
    return new Promise<boolean>((res) => {
      dispatch({
        type: actions.CONFIRM_COMMON, 
        payload: {
          title: t`Изменение языка приложения`,
          question: t`Изменение языка вступят в силу после перезапуска. Перезапустить сейчас?`,
          buttons: [
          { 
            children: t`Да`, 
            onPress: () => onLangChange(value as AppLocales, true)
          },
          { 
            children: t`Перезапустить позже`, 
            onPress: () => {
              onLangChange(value as AppLocales)
              dispatch({ type: actions.CLEAR })
              res(true)
            }
          },
          { 
            children: t`Отменить`, 
            onPress: () => {
              dispatch({ type: actions.CLEAR })
              res(false)
            }
          }
        ]
        }
      })
    })
  }, [dispatch])

  return (
    <List.Accordion
      title={t`Язык приложения`}
      left={props => <List.Icon {...props} icon="translate" />}
    >
      <SettingsRadioGroup
        group={localVariants}
        name="Lang"
        onChange={onChange}
        initial={appConfigSync.lang}
      />
    </List.Accordion>
  )
}
