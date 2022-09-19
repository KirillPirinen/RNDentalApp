import React, { useCallback } from 'react'
import { Divider, useTheme } from 'react-native-paper'
import { FlatList} from 'react-native'
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider'
import withObservables from '@nozbe/with-observables'
import { Container, Autocomplete, FAB, EmptyList, Patient } from '../components'
import { useIsFocused } from '@react-navigation/native'
import { defaultExtractor } from '../utils/defaultFn'
import { useModal } from '../context/modal-context'
import { useFabControlsRef } from '../utils/custom-hooks/useSafeRef'

const wrapper = { marginVertical: 12 }
const renderDivider = () => <Divider bold />
const renderList = ({ result, navigation, ...rest }) => {
  const theme = useTheme()
  const renderItem = useCallback(({ item }) => 
    <Patient patient={item} navigation={navigation} theme={theme} />, [])
  return (
      <FlatList
        data={result}
        keyExtractor={defaultExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={renderDivider}
        style={wrapper}
        ListEmptyComponent={EmptyList}
        {...rest}
      />
  )
}

export const PatientsList = ({ patients, navigation }) => {
  const [actions, dispatch] = useModal()
  const isFocused = useIsFocused()

  const onChange = (query) => 
    patients.filter(patient => patient.fullName.toLowerCase().includes(query))


    const [ref, onDrop, onDrag] = useFabControlsRef()

  const onChoosePatientMethod = () => dispatch({ 
    type: actions.CHOOSE_ADD_PATIENT_METHOD,
    payload: { 
      onAlone: () => navigation.navigate('AddPatient'), 
      onBulk: () => navigation.navigate('ImportContacts')  
    }
  })

  return (
      <Container>
          {isFocused && <Autocomplete
            onChange={onChange}
            renderList={renderList}
            initState={patients || []}
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
