import React, { useRef } from 'react'
import { Divider } from 'react-native-paper';
import { FlatList, SafeAreaView, View } from 'react-native';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider'
import withObservables from '@nozbe/with-observables';
import { Container, Autocomplete, Patient, FAB, EmptyList } from '../components'
import { useNavigation } from '@react-navigation/native';
import { defaultExtractor } from '../utils/defaultExtracror';
import { useModal } from '../context/modal-context';


const renderList = ({ result, ...rest }) => {
  const navigation = useNavigation()
  return (
      <FlatList
        data={result}
        keyExtractor={defaultExtractor}
        renderItem={({ item }) => <Patient 
          patient={item}
          onPress={() => navigation.navigate('Detail', { patient: item })}
        />}
        ItemSeparatorComponent={() => <Divider bold />}
        style={{ marginVertical: 12 }}
        ListFooterComponent={!result.length && EmptyList}
        {...rest}
      />
  )
}

export const PatientsList = ({ patients, navigation }) => {
  const [actions, dispatch] = useModal()

  const onChange = (query) => 
    patients.filter(patient => patient.fullName.toLowerCase().includes(query))

  const buttonControls = useRef()

  const onChoosePatientMethod = () => dispatch({ 
    type: actions.CHOOSE_ADD_PATIENT_METHOD,
    payload: { 
      onAlone: () => navigation.navigate('AddPatient'), 
      onBulk: () => navigation.navigate('ImportContacts')  
    }
  })

  const onDrug = () => buttonControls.current?.setVisible(false)
  const onDrop = () => buttonControls.current?.setVisible(true)

  return (
      <Container>
          <Autocomplete
            onChange={onChange}
            renderList={renderList}
            initState={patients}
            onScrollBeginDrag={onDrug}
            onScrollEndDrag={onDrop}
          />
          <FAB
            ref={buttonControls} 
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
);
