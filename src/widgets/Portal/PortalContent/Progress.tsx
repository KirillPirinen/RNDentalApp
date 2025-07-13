import React, { useState, useEffect, FC } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { Button, Modal, Text, ActivityIndicator } from 'react-native-paper'
import { ContextedPortalDefaultProps } from '..'
import actionTypes from '../../../context/general-context/action-types'
import { Trans, t } from '@lingui/macro'

const getDefaultTextsResolvers = () => (
  {
    contactsImport: { 
      title: t`Успешно добавлено`,
      error: t`Данные контакты импортированы с ошибками`
    },
    filesExport: {
      title: t`Успешно экспортировано`,
      error: t`Файлы данных пациентов экспортированы с ошибками`
    },
  }
)

export type ProgressModes = keyof ReturnType<typeof getDefaultTextsResolvers>

export type ProgressResult = {
  success: number;
  fail: number;
  total: number;
  failedValues: Array<{
    reason?: string;
    name: string;
  }>
}

export type ProgressProps = ContextedPortalDefaultProps<{
  runJob: () => Promise<ProgressResult | null>;
  mode?: ProgressModes;
  onDone?: (data: ProgressResult) => void;
}>

export const Progress: FC<ProgressProps> = ({ 
  __visible, 
  __defaultProps,
  runJob,
  mode = 'contactsImport',
  onDone
}) => {

  const [done, setDone] = useState<ProgressResult | null>(null)
  const hasErrors = Boolean(done?.failedValues.length)
  const resolvers = getDefaultTextsResolvers()
  const { title, error } = resolvers[mode]
  
  const onExit = done ? function () {
    __defaultProps.clear()
    onDone?.(done)
  } : undefined

  useEffect(() => {
    const timer = setTimeout(() => 
    runJob()
      .then(data => {
        if(data) setDone(data)
        else __defaultProps.clear()
      })
      .catch((e: any) => {
        __defaultProps.dispatch({ type: actionTypes.INFO, payload: {
          text: `${t`Ошибка`}: ${e.message || 'unknown'}`,
          color: 'errorContainer'
        }})
      }), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Modal
      dismissable={Boolean(done)}
      onDismiss={onExit}
      visible={__visible} 
      contentContainerStyle={styles.modal}
    > 
      {done ? (
        <>
          <Text variant="bodyLarge">{`${title}:`} {`${done.success} ${t`из`} ${done.total}`} </Text>
          {hasErrors && (
            <>
              <Text variant="bodyLarge">{`${error}:`}</Text>
              <ScrollView>
                {done.failedValues.map((value, i) => {
                  return (
                    <React.Fragment key={i}>
                      <Text>{value.name}</Text>
                      {value.reason && <Text style={{ color: 'red' }}>{` - ${value.reason}`}</Text>}
                    </React.Fragment>
                  )
                })}
              </ScrollView>
            </>
          )}
          <Button onPress={onExit}><Trans>Выйти</Trans></Button>
        </>
      ): <ActivityIndicator size="large" color={__defaultProps.theme.colors.primary} />}
    </Modal>
  ) 

}

const styles = StyleSheet.create({
  modal: { backgroundColor: 'white', padding: 20 }
})
