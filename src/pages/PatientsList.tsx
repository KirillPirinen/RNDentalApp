import { Divider } from 'react-native-paper'
import { FlatList, Keyboard, View, FlatListProps } from 'react-native'
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider'
import withObservables from '@nozbe/with-observables'
import { Container, Autocomplete, FAB, EmptyList, Patient } from '../components'
import { NavigationProp, useIsFocused } from '@react-navigation/native'
import { useGeneralControl } from '../context/general-context'
import { useFabControlsRef } from '../utils/custom-hooks/useSafeRef'
import { Database, Q } from '@nozbe/watermelondb'
import { querySanitazer } from '../utils/sanitizers'
import { PatientPhones } from '../components/PatientPhones'
import { HighlightedText } from '../components/HighlightedText'
import PatientModel from '../db/models/Patient'
import { FC } from 'react'
import { useAppTheme } from '../styles/themes'

const wrapper = { marginVertical: 12 } as const
const renderDivider = () => <Divider bold />

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
        ItemSeparatorComponent={renderDivider}
        style={wrapper}
        ListEmptyComponent={EmptyList}
        ListFooterComponent={<View style={{ height: 100 }} />}
        {...rest}
      />
  )
}

const dissmisHandle = () => {
  if (Keyboard.isVisible()) {
    Keyboard.dismiss()
  }
  return true
}

export type PatientsListProps = {
  navigation: NavigationProp<ReactNavigation.RootParamList>
  patients: PatientModel[]
  database: Database
}

export const PatientsList: FC<PatientsListProps> = ({ patients, navigation, database }) => {
  const [actions, dispatch] = useGeneralControl()
  const isFocused = useIsFocused()

  const onChange = async (query: string) => {
    if (/^\d/.test(query)) {
      const res = await database.get<PatientModel>('patients').query(
        Q.experimentalJoinTables(['phones']),
        Q.on('phones', 'number', Q.like(`%${querySanitazer(query)}%`))
      ).fetch()
      return res
    }
    return patients.filter(patient => patient.fullName.toLowerCase().includes(query))
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
      <Container onStartShouldSetResponder={dissmisHandle}>
          {isFocused && <Autocomplete
            onChange={onChange}
            renderList={renderList}
            initState={patients}
            onScrollBeginDrag={onDrag}
            onScrollEndDrag={onDrop}
            removeClippedSubviews={true}
            navigation={navigation}
          />}
          <FAB
            ref={ref}
            label="Добавить пациента"
            onPress={onChoosePatientMethod}
          />
      </Container>
  )
}

export default withDatabase(
  withObservables([], ({ database }: { database: Database }) => ({
    patients: database.get<PatientModel>('patients').query()
  }))(PatientsList)
)
