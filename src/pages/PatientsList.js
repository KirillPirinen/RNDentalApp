import { Divider, Text, Surface, Avatar } from 'react-native-paper';
import { FlatList } from 'react-native';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider'
import withObservables from '@nozbe/with-observables';
import { Container, Autocomplete, Patient, PlusButton, EmptyList } from '../components'
import { useNavigation } from '@react-navigation/native';

const renderList = ({ result }) => {
  const navigation = useNavigation()
  return (
    <FlatList
      data={result}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <Patient 
        patient={item}
        onPress={() => navigation.navigate('Detail', { patient: item })}
      />}
      ItemSeparatorComponent={Divider}
      style={{ marginVertical: 12 }}
      ListFooterComponent={!result.length && EmptyList}
    />
  )
}

export const PatientsList = ({ patients, navigation }) => {

  const onChange = (query) => 
    patients.filter(patient => patient.fullName.toLowerCase().includes(query))

  return (
    <Container>
      <Autocomplete
        onChange={onChange}
        renderList={renderList}
        initState={patients}
      />
      <PlusButton onPress={() => navigation.navigate('AddPatient')}/>
    </Container>
  )
}

export default withDatabase(
  withObservables([], ({ database }) => ({
    patients: database.get('patients').query()
  }))(PatientsList), 
);
