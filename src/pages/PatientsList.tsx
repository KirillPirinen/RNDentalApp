import { FlatList, View, FlatListProps, StyleSheet } from 'react-native'
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider'
import withObservables from '@nozbe/with-observables'
import { Autocomplete, FAB, EmptyList, Patient } from '../components'
import { NavigationProp, useIsFocused } from '@react-navigation/native'
import { useGeneralControl } from '../context/general-context'
import { useFabControlsRef } from '../utils/custom-hooks/useSafeRef'
import { Database, Q } from '@nozbe/watermelondb'
import { querySanitazer } from '../utils/sanitizers'
import { PatientPhones } from '../components/PatientPhones'
import { HighlightedText } from '../components/HighlightedText'
import PatientModel from '../db/models/Patient'
import { FC, useEffect, useMemo, useState } from 'react'
import { useAppTheme } from '../styles/themes'
import { defaultDissmisHandle, renderDefaultDivider } from '../utils/defaultFn'
import Group from '../db/models/Group'
import DropDownPicker from 'react-native-dropdown-picker';
import { FontAwesome } from '@expo/vector-icons';
import { t } from '@lingui/core/macro'
import { appConfigSync } from '../consts/config'

DropDownPicker.modifyTranslation('RU', {
  PLACEHOLDER: 'Выберите группу',
  SEARCH_PLACEHOLDER: 'Ищем группы',
  SELECTED_ITEMS_COUNT_TEXT: {
    1: 'Выбрана одна группа',
    2: 'Две группы выбраны',
    n: '{count} групп выбрано'
  },
  NOTHING_TO_SHOW: ''
})

const picker = {
  backgroundColor: 'rgb(247,243,249)',
  borderWidth: 1,
  borderColor: "rgba(0,0,0,0.3)"
} as const

const footer = <View style={{ height: 100 }} />

type renderListProps = Omit<FlatListProps<PatientModel>, 'renderItem' | 'data'> & { 
  result: PatientModel[];
  navigation: NavigationProp<ReactNavigation.RootParamList>;
  searchQuery: string;
}

const renderList = ({ result, navigation, searchQuery: searchQueryRaw, ...rest }: renderListProps) => {
  const theme = useAppTheme()
  const searchQuery = querySanitazer(searchQueryRaw)
  return (
      <FlatList
        data={result}
        renderItem={({ item }) => (
          <Patient
            patient={item}
            navigation={navigation}
            theme={theme}
            renderName={(name) => <HighlightedText text={name} query={searchQuery} />}
          >
            <PatientPhones patient={item} query={searchQuery} />
          </Patient>
        )}
        ItemSeparatorComponent={renderDefaultDivider}
        style={styles.listWrapper}
        ListEmptyComponent={EmptyList}
        ListFooterComponent={footer}
        {...rest}
      />
  )
}

export type PatientsListProps = {
  navigation: NavigationProp<ReactNavigation.RootParamList>
  patients: PatientModel[]
  groups: Group[]
  database: Database
}

export const PatientsList: FC<PatientsListProps> = ({ patients, groups, navigation, database }) => {
  const [open, setOpen] = useState(false);
  const [groupIds, setGroupIds] = useState<Array<string>>([]);
  const [actions, dispatch] = useGeneralControl()
  const isFocused = useIsFocused()

  const groupItems = useMemo(() => groups.map(group => 
    ({
      label: group.name,
      value: group.id,
      icon: () => <FontAwesome name="group" size={16} color={group.color ?? 'black'} />
    })
  ), [groups])

  useEffect(() => {
    return () => {
      setGroupIds([])
      setOpen(false)
    }
  }, [isFocused])

  const filtered = useMemo(async () => {
    if(!groupIds.length) return patients
    return await database.get<PatientModel>('patients').query(
      Q.experimentalJoinTables(['patients_groups']),
      Q.on('patients_groups', 'group_id', Q.oneOf(groupIds))
    )
  }, [patients, groupIds])

  const onChange = async (query: string) => {
    const collection = database.get<PatientModel>('patients')
    let filteredPatients = patients
    if (/^\d/.test(query)) {
       return await collection.query(
        Q.experimentalJoinTables(['phones', 'patients_groups']),
        Q.and(
          Q.on('phones', 'number', Q.like(`%${query}%`)),
          ...(groupIds.length ? [Q.on('patients_groups', 'group_id', Q.oneOf(groupIds))] : [])
        )
      ).fetch()
    } else if (groupIds.length) {
      filteredPatients = await collection.query(
        Q.experimentalJoinTables(['patients_groups']),
        Q.on('patients_groups', 'group_id', Q.oneOf(groupIds))
      )
    }
    return filteredPatients.filter(patient => patient.fullName.toLowerCase().includes(query.toLowerCase()))
  }

  const [ref, onDrop, onDrag] = useFabControlsRef()

  const onChoosePatientMethod = () => dispatch({
    type: actions.CHOOSE_ADD_PATIENT_METHOD,
    payload: {
      onAlone: () => navigation.navigate('AddPatient'),
      onBulk: () => navigation.navigate('ImportContacts')
    }
  })

  return (
      <View 
        onStartShouldSetResponder={() => {
          setOpen(false)
          return defaultDissmisHandle()
        }} 
        style={styles.wrapper}
      >
          {isFocused && <Autocomplete
            onChange={onChange}
            renderList={renderList}
            initState={filtered}
            onScrollBeginDrag={onDrag}
            onScrollEndDrag={onDrop}
            removeClippedSubviews={true}
            navigation={navigation}
            barStyle={{ margin: 25, marginBottom: 10 }}
            onFocus={() => setOpen(false)}
          >
            {groups.length > 0 && (
              <View style={{ marginHorizontal: 25 }}>
                <DropDownPicker
                  multiple={true}
                  min={0}
                  open={open}
                  value={groupIds}
                  items={groupItems}
                  setOpen={setOpen}
                  setValue={setGroupIds}
                  //@ts-ignore
                  language={appConfigSync.lang.toLocaleUpperCase()}
                  style={picker}
                />
              </View>
            )}
            </Autocomplete>
          }
          <FAB
            ref={ref}
            label={t`Добавить пациента`}
            onPress={onChoosePatientMethod}
          />
      </View>
  )
}

const styles = StyleSheet.create({
  wrapper: { height: '100%' },
  listWrapper: { marginBottom: 66, marginTop: 12 }
})

export default withDatabase(
  withObservables([], ({ database }: { database: Database }) => ({
    patients: database.get<PatientModel>('patients').query(),
    groups: database.get<Group>('groups').query()
  }))(PatientsList)
)
