import { Divider, Text, Surface, Avatar } from 'react-native-paper';
import { FlatList } from 'react-native';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider'
import withObservables from '@nozbe/with-observables';
import { Container, Autocomplete, Patient, PlusButton } from '../components'
import { useNavigation } from '@react-navigation/native';

const Empty = () => (
  <Surface elevation={5} style={{ padding: 12, alignItems:'center', justifyContent:'center' }}>
    <Avatar.Icon size={30} style={{ backgroundColor: 'red', marginBottom: 10 }} icon="exclamation-thick" />
    <Text variant="labelLarge">Ничего не найдено</Text>
  </Surface>
)

const renderList = ({ result }) => {
  const navigation = useNavigation()
  return (
    <FlatList
      data={result}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <Patient 
        patient={item}
        onPress={() => navigation.navigate('Detail', item)}
      />}
      ItemSeparatorComponent={Divider}
      style={{ marginVertical: 12 }}
      ListFooterComponent={!result.length && Empty}
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
