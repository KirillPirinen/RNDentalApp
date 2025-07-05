import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { StyleSheet, View, FlatList, FlatListProps  } from 'react-native'
import { TextInput, Button, Text } from 'react-native-paper'
import { SwipeViewButton } from '../components'
import { useGeneralControl } from '../context/general-context'
import { createGroup } from '../db/actions'
import { NavigationProp } from '@react-navigation/native'
import Group from '../db/models/Group'
import { useAppTheme } from '../styles/themes'
import { EmptyList, Patient } from '../components'
import PatientModel from '../db/models/Patient'
import { defaultDissmisHandle, renderDefaultDivider } from '../utils/defaultFn'
import PatientSearch from '../widgets/PatientSearch'
import { FontAwesome5 } from '@expo/vector-icons'; 
import { useDatabase } from '@nozbe/watermelondb/hooks'
import PatientsGroups from '../db/models/PatientsGroups'
import randomId from '@nozbe/watermelondb/utils/common/randomId'
import { AppColorPicker } from '../components/AppColorPicker'
import tinycolor2 from 'tinycolor2'
import { Trans } from '@lingui/react/macro'
import { t } from '@lingui/core/macro'

const footer = <View style={{ height: 100 }} />

type PatientListProps = Omit<FlatListProps<PatientModel>, 'renderItem' | 'data'> & { 
  patients: PatientModel[];
  navigation: NavigationProp<ReactNavigation.RootParamList>;
  onRemove: (pat: PatientModel) => void;
}

const PatientList: FC<PatientListProps> = ({ patients, navigation, onRemove, ...rest }) => {
  const theme = useAppTheme()

  const renderItem = useCallback(({ item }: { item: PatientModel }) => (
    <View style={styles.patientItem}>
      <Patient
        patient={item}
        navigation={navigation}
        theme={theme}
        style={styles.patient}
      />
      <SwipeViewButton style={styles.deleteBtn} onPress={() => onRemove(item)}>
        <FontAwesome5 name="minus" size={16} color={theme.colors.error} />
      </SwipeViewButton>
    </View>
  ), [theme, onRemove, navigation])

  return (
      <FlatList
        data={patients}
        renderItem={renderItem}
        ItemSeparatorComponent={renderDefaultDivider}
        ListEmptyComponent={EmptyList}
        ListFooterComponent={footer}
        {...rest}
      />
  )
}

export type AddGroupProps = {
  navigation: NavigationProp<ReactNavigation.RootParamList>
  route: { params?: ReactNavigation.RootParamList['AddGroup'] }
}

type Task = { type: 'create' | 'delete', patient: PatientModel }

const AddGroup: FC<AddGroupProps> = ({ navigation, route: { params } }) => {

  const database = useDatabase()
  const group: Group | undefined = params?.group
  
  const theme = useAppTheme()

  const mutabaleState = useRef<{
    tasks: Record<string, Task>;
    preparedGroupId: string;
    associations: PatientsGroups[];
  }>({
    tasks: {},
    preparedGroupId: group?.id || randomId(),
    associations: []
  })

  const preparedGroupId = useRef<string>(group?.id || randomId()).current
  const [patients, setPatients] = useState<PatientModel[]>([])
  const [mode, setMode] = useState<'add' | 'color'>()
  const [actions, dispatch] = useGeneralControl()
  const [name, setName] = useState<string>(group?.name || '')
  const [description, setDescription] = useState<string>(group?.description || '')
  const [color, setColor] = useState(group?.color || '');
  const [error, setError] = useState<{ name?: boolean }>({})

  useEffect(() => {
    group?.allPatients.fetch().then(setPatients)
    group?.associatedRecords.fetch().then((associations) => (mutabaleState.current.associations = associations))
  }, [])
  
  const onSubmit = () => {
    if(!name) {
      return setError({ name: true })
    }

    const batchesArr = Object.values(mutabaleState.current.tasks).map(task => {
      if (task.type === 'create') {
        return database.get<PatientsGroups>('patients_groups').prepareCreate((instance) => {
          instance.groupId = preparedGroupId
          instance.patientId = task.patient.id
        })
      } else if (task.type === 'delete') {
        const association = mutabaleState.current.associations.find(a => a.patientId === task.patient.id)
        return association?.prepareDestroyPermanently()
      }
    })

    if(params?.edit) {
      return params.group.updateInstance({ description, name, color }, batchesArr.length && batchesArr).then(navigation.goBack)
    } 

    database.write(async () => {
      const instanceBatch = await createGroup({ name, description, color }, true, preparedGroupId)
      await database.batch(instanceBatch, ...batchesArr)
    }).then(() => {
      setTimeout(() => {
        dispatch({ 
          type: actions.INFO,
          payload: { 
            text: t`Вы успешно добавили новую группу`
          }
        })
      }, 500)
      // @ts-ignore
      navigation.goBack()
    })
  }

  const onChangeTextName = (text: string) => {
    if(error.name) setError({})
    setName(text)
  }

  const onRemove = useCallback(async (patient: PatientModel) => {
    if (mutabaleState.current.tasks[patient.id]) {
      delete mutabaleState.current.tasks[patient.id]
    } else if (group) {
      mutabaleState.current.tasks[patient.id] = { type: 'delete', patient }
    }

    setPatients(prev => prev.filter(p => p.id !== patient.id))
  }, [setPatients])

  if (mode === 'add') {
    return (
      <PatientSearch 
        barStyle={styles.searchBar} 
        setChoosed={(patient) => {
          if (patients.includes(patient)) {
            dispatch({ type: actions.INFO, payload: {
              text: t`Пациент ${patient.fullName} уже добавлен в эту группу.`,
              color: 'errorContainer'
            }})
          } else {
            mutabaleState.current.tasks[patient.id] = { type: 'create', patient }
            setPatients(prev => [...prev, patient])
          }
          setMode(undefined)
        }}
      />
    )
  }

  if(mode === 'color') {
    return (
      <AppColorPicker 
        onSelect={(hex: string) => {
          setColor(hex)
          setMode(undefined)
        }}
        defaultColor={color}
        onCancel={() => setMode(undefined)}
      />
    )
  }

  return (
    <>
      <View onStartShouldSetResponder={defaultDissmisHandle} style={{ paddingHorizontal: 25, paddingBottom: 10, paddingTop: 25 }}>
        <Button 
          mode={tinycolor2(color).isDark() ? "contained" : 'contained-tonal'}
          buttonColor={color}
          onPress={() => setMode('color')}
          style={styles.colorBtn}
        >
          <Trans>Изменить цвет</Trans>
        </Button>
        <TextInput
          label={t`Название группы`}
          mode="outlined"
          value={name}
          onChangeText={onChangeTextName}
          error={error.name}
        />
        <View>
          <TextInput
            label={t`Описание`}
            mode="outlined"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            style={styles.multiline}
          />
        </View>
        <Button 
          style={styles.saveBtn} 
          icon="plus-thick" 
          mode="contained" 
          buttonColor={'green'}
          onPress={onSubmit}
        >
          {params?.edit ? t`Сохранить изменения` : t`Добавить группу`}
        </Button>
        <Button 
          style={styles.addBtn} 
          icon="plus-thick" 
          mode="contained"
          buttonColor={theme.colors.primary}
          onPress={() => setMode('add')}
        >
          <Trans>Добавить участника</Trans>
        </Button>
      </View>
      {patients.length > 0 && (
        <>
          <Text variant="bodyLarge" style={{ paddingLeft: 25, paddingBottom: 10 }}><Trans>Участники</Trans>:</Text>
          <PatientList patients={patients} navigation={navigation} onRemove={onRemove} />
        </>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  multiline: { marginTop: 10 },
  itemTitle: { fontSize:14 },
  item: { height: 40 },
  patientItem: { flexDirection: 'row', height: 75 },
  patient: { minWidth: '90%' },
  deleteBtn: { width: '10%' },
  saveBtn: { marginTop: 20 },
  addBtn: { marginTop: 10 },
  searchBar: { margin: 25, marginBottom: 10 },
  colorBtn: { marginBottom: 15 }
})

export default AddGroup

