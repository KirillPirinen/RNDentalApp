import { useState } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import styled, { useTheme } from 'styled-components'
import DatePicker from '@react-native-community/datetimepicker'
import { Container, Autocomplete } from '../components'
import { Button, TextInput as Input, Searchbar, Surface, Text, Divider } from 'react-native-paper'
import shadow from 'react-native-paper/src/styles/shadow'

const AddAppointment = () => {
  const [calendar, setCalendar] = useState(false)
  const [time, setTime] = useState(false)
  const theme = useTheme()
  const [searchQuery, setSearchQuery] = useState('');

  const onChangeSearch = query => setSearchQuery(query);
  return (
    <Container>
      <Autocomplete />
      <View style={{ marginTop: 20, marginLeft: 0 }} floatingLabel>
        <Text>Цена</Text>
        <Input
          keyboardType="numeric"
          style={{ marginTop: 12 }}
        />
      </View>
      <View style={{ marginTop: 20, marginLeft: 0 }}>
        <TimeRow>
          <View style={{ flex: 1 }}>
            {calendar && <DatePicker
              date={new Date()}
              mode="date"
              placeholder="Дата"
              format="YYYY-MM-DD"
              minDate={new Date()}
              confirmBtnText="Сохранить"
              cancelBtnText="Отмена"
              showIcon={false}
              value={new Date(2300, 10, 20)}
              customStyles={{
                dateInput: {
                  borderWidth: 0
                },
                dateText: {
                  fontSize: 18
                }
              }}
            />}
          </View>
          <View style={{ flex: 1 }}>
            {time && <DatePicker
              mode="time"
              placeholder="Время"
              format="HH:mm"
              minDate={new Date()}
              confirmBtnText="Сохранить"
              cancelBtnText="Отмена"
              showIcon={false}
              value={new Date(2300, 10, 20)}
              customStyles={{
                dateInput: {
                  borderWidth: 0
                },
                dateText: {
                  fontSize: 18
                }
              }}
            /> }
          </View>
        </TimeRow>
      </View>
      <ButtonView>
        <Button icon="plus-thick" mode="contained" color={theme.primary} onPress={() => console.log('Pressed')}>
          Добавить прием
        </Button>
      </ButtonView>
    </Container>
  );
};

const ListItem = styled.Text`
  width:100%;
  margin-bottom: 10px;
  margin-top: 10px;
`
const List = styled(Surface)`
  position: absolute;
  background: white;
  top:49px;
  width: 100%;
  padding: 15px 20px;
  z-index: 2;
`
const ButtonView = styled.View`
  flex: 1;
  margin-top: 30px;
`;

const TimeRow = styled.View`
  flex-direction: row;
`;

export default AddAppointment
