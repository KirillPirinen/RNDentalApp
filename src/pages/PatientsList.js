import { useCallback } from 'react'
import { Divider, useTheme } from 'react-native-paper'
import { FlatList, Keyboard, View } from 'react-native'
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider'
import withObservables from '@nozbe/with-observables'
import { Container, Autocomplete, FAB, EmptyList, Patient } from '../components'
import { useIsFocused } from '@react-navigation/native'
import { defaultExtractor } from '../utils/defaultFn'
import { useGeneralControl } from '../context/general-context'
import { useFabControlsRef } from '../utils/custom-hooks/useSafeRef'
import { Q } from '@nozbe/watermelondb'
import { querySanitazer } from '../utils/sanitizers.js'
import { PatientPhones } from '../components/PatientPhones.js'
import { HighlightedText } from '../components/ HighlightedText.js'

const wrapper = { marginVertical: 12 }
const renderDivider = () => <Divider bold />
const renderList = ({ result, navigation, searchQuery, ...rest }) => {
  const theme = useTheme()
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
  if(Keyboard.isVisible()) {
    Keyboard.dismiss()
  }
  return true
}

export const PatientsList = ({ patients, navigation, database }) => {
  const [actions, dispatch] = useGeneralControl()
  const isFocused = useIsFocused()

  const onChange = async (query) => {
    if(/^\d/.test(query)) {
      const res = await database.get('patients').query(
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
  withObservables([], ({ database }) => ({
    patients: database.get('patients').query()
  }))(PatientsList), 
)
