import { Divider } from 'react-native-paper';
import { FlatList, View } from 'react-native';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider'
import withObservables from '@nozbe/with-observables';
import { Container, Autocomplete, Patient, PlusButton } from '../components'

const renderList = ({ result }) => (
  <FlatList
    data={result}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => <Patient 
    {...item}
    onPress={() => navigation.navigate('Detail')}
    />}
    ItemSeparatorComponent={Divider}
  />
)

export const PatientsList = ({ patients, navigation, database }) => {

  const onChange = (query) => patients.filter(patient => {
    return patient.lname.toLowerCase().includes(query) && patient.name.toLowerCase().includes(query)
  })

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
    patients: database.collections.get('patients').query().observe(),
  }))(PatientsList),
);
