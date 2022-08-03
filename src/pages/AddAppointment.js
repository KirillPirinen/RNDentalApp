import { useState } from 'react'
import { View } from 'react-native'
import styled from 'styled-components'
import DatePicker from '@react-native-community/datetimepicker'
import { Container, Autocomplete } from '../components'
import { Button, TextInput as Input, Surface, Text, useTheme } from 'react-native-paper'
import { useSelector } from 'react-redux'
import { getPatients } from '../redux/patientSlice'

const AddAppointment = () => {
  const [calendar, setCalendar] = useState(false)
  const [time, setTime] = useState(false)
  const theme = useTheme()
  const patients = useSelector(getPatients)

  const onChange = (query) => patients.filter(patient => patient.name.toLowerCase().includes(query))

  return (
    <Container>
      <Autocomplete onChange={onChange}/>
      <View style={{ marginTop: 20, marginLeft: 0 }} floatingLabel>
        <Text>Цена</Text>
        <Input
          mode="outlined"
          label="Планируемые операции"
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
        <Button icon="plus-thick" mode="contained" color={theme.colors.primary} onPress={() => console.log('Pressed')}>
          Добавить прием
        </Button>
      </ButtonView>
    </Container>
  );
};

const ButtonView = styled.View`
  flex: 1;
  margin-top: 30px;
`;

const TimeRow = styled.View`
  flex-direction: row;
`;

export default AddAppointment
