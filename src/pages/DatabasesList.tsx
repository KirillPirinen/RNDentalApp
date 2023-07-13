import React, { FC, useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { useGeneralControl } from '../context/general-context'
import { ScrollView } from 'react-native-gesture-handler'
import { NavigationProp } from '@react-navigation/native'
import * as FileSystem from 'expo-file-system';
import { getFileNameWithoutExt } from '../utils/fileHelpers'
import { exportDB } from '../db/utils/exportDB'
import { List } from 'react-native-paper'
import { appConfigSync } from '../consts/config'
import { DEFAULT_DB_NAME, IMPORTED_DB_PATH } from '../consts'
import AsyncStorage from '@react-native-async-storage/async-storage'
import RNRestart from 'react-native-restart'
import { deleteDB } from '../db/utils/deleteDB'
import { useFilesPicker } from '../utils/custom-hooks/useFilesPicker'
import { importDB } from '../db/utils/importDB'

export type DatabasesListProps = {
  navigation: NavigationProp<ReactNavigation.RootParamList>
}

const DatabasesList: FC<DatabasesListProps> = ({ navigation }) => {
  const [actions, dispatch] = useGeneralControl()
  const [databases, setDatabases] = useState<Array<string>>([DEFAULT_DB_NAME])

  const pickFiles = useFilesPicker(['application/octet-stream'])

  const checkDBFiles = () => {
    FileSystem.readDirectoryAsync(IMPORTED_DB_PATH).then(list => {
      const newList = [DEFAULT_DB_NAME]

      list.forEach(fileName => {
        if (fileName.endsWith('.db')) {
          newList.push(getFileNameWithoutExt(fileName, '.db'))
        }
      })

      setDatabases(newList)
    }).catch(e => dispatch({ type: actions.INFO , payload: { 
      text: 'Вы еще не импортировали внешние БД.'
    }}))
  }

  useEffect(checkDBFiles, [])

  const onSelect = async (dbName: string) => {
    if(appConfigSync.dbName === dbName) return;
    await AsyncStorage.setItem('dbName', getFileNameWithoutExt(dbName, '.db'))
    RNRestart.restart()
  }

  const onExport: typeof exportDB = async (dbName: string) => { 
    try {
      await exportDB(dbName)
    } catch (e: any) {
      dispatch({ type: actions.INFO, payload: { 
        text: `Ошибка экспорта': ${e.message}`,
        color: 'errorContainer'
      }})
    }
  }

  const onDelete = async (dbName: string) => {
    dispatch({ type: actions.CONFIRM_DELETE, payload: {
      mode: 'database',
      dbName,
      onDelete: async () => {
        try {
          await deleteDB(dbName)

          dispatch({ type: actions.INFO, payload: { text: `Успешно удалено` }})

          checkDBFiles()
        } catch (e: any) {
          dispatch({ type: actions.INFO, payload: { 
            text: `Ошибка удаления': ${e.message}`,
            color: 'errorContainer'
          }})
        }
      }
    }})
  }

  const onImport = async () => {
    try {
      const files = await pickFiles()
      await importDB(files ?? [])
      checkDBFiles()
    } catch (e: any) {
      dispatch({ type: actions.INFO, payload: { 
        text: `Ошибка импорта: ${e.message}`,
        color: 'errorContainer'
      }})
    }
  }

  return (
    <>
    <List.Item 
      title="Прочитать инструкцию" 
      titleStyle={{ color: 'green' }}
      onPress={() => dispatch({ type: actions.USER_INFO, payload: {
        mode: "migrate"
      }})} 
      left={props => <List.Icon {...props} color={'green'} icon="information-outline" />}
    />
    <List.Item 
      title="Импортировать новую БД"
      onPress={onImport} 
      left={props => <List.Icon {...props} icon="database-import" />}
    />
    <List.Section title='Доступные БД:'>
      <ScrollView>
        <List.AccordionGroup>
        {databases?.map((dbName) => {
          const isActiveDB = dbName === appConfigSync.dbName
          const isDefault = dbName === DEFAULT_DB_NAME
          const color = isActiveDB ? 'green' : 'grey'
          return (
            <List.Accordion
              id={dbName}
              key={dbName}
              title={dbName + (isActiveDB ? ' (смонтирована)' : '')}
              left={props => {
                return (
                  <>
                    <List.Icon {...props} color={color} icon={isActiveDB ? 'database-check' : 'database-outline'} />
                    {isDefault && <List.Icon {...props} color={color} icon="lock" />}
                  </>
                )
              }}
              titleStyle={{ color }}
            >
              {!isActiveDB && <List.Item 
                title="Монтировать" 
                onPress={() => onSelect(dbName)}
                style={styles.button} 
                left={props => <List.Icon {...props} icon="database-eye" />}
              />}
              <List.Item 
                title="Экспортировать" 
                onPress={() => onExport(dbName)}
                style={styles.button}
                left={props => <List.Icon {...props} icon="database-export" />}
              />
              {!isDefault && <List.Item 
                title="Удалить"
                onPress={() => onDelete(dbName)}
                style={styles.button}
                left={props => <List.Icon {...props} icon="database-off" />}
              />}
          </List.Accordion>
          )
        })}
        </List.AccordionGroup>
      </ScrollView>
    </List.Section>
    </>
  )
}

const styles = StyleSheet.create({
  wrapper: { margin: 25 },
  button: {
    paddingLeft: 24,
    paddingRight: 16
  },
})

export default DatabasesList
