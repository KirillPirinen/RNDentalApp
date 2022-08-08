import { useState } from 'react'
import { View, FlatList, Divider } from 'react-native'
import styled from 'styled-components'
import DatePicker from '@react-native-community/datetimepicker'
import { Container, Autocomplete, Patient, EmptyList } from '../components'
import { Button, TextInput as Input, Text, useTheme } from 'react-native-paper'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import { Q } from '@nozbe/watermelondb';
import { useNavigation } from '@react-navigation/native'
import formatRu from '../utils/formatRu'
import { createAppointment } from '../db/actions'
import Slider from '@react-native-community/slider';

const onSearch = (db) => async (query) => {
  const sanitized = Q.sanitizeLikeString(query)
  return db.get('patients').query(
    Q.or(
      Q.where('first_name', Q.like(`%${sanitized}%`)),
      Q.where('last_name', Q.like(`%${sanitized}%`))
    )
  )
}

const renderList = ({ result, onChoose }) => {
  const navigation = useNavigation()
  return Boolean(result) && (
    <FlatList
      data={result}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <Patient 
        patient={item}
        onPress={() => onChoose(item)}
        onLongPress={() => navigation.navigate('Detail', { patient: item })}
      />}
      ItemSeparatorComponent={Divider}
      style={{ marginVertical: 12 }}
      ListFooterComponent={!result.length && EmptyList}
    />
  )
}

const initState = { mode: null, сurrent: new Date() }

const AddAppointment = ({ navigation, route: { params } }) => {

  const appointment = params?.appointment || {}
  const patient = params?.patient
  const isEditMode = Boolean(params?.patient)

  const theme = useTheme()
  const db = useDatabase()

  const [dateMeta, setDateMeta] = useState(appointment.date ? 
    {...initState, date: appointment.date } : initState
  )
  const [choosed, setChoosed] = useState(patient || null)
  const [diagnosis, setDiagnosis] = useState(appointment.diagnosis || '')
  const [notes, setNotes] = useState(appointment.notes || '')
  const [duration, setDuration] = useState(appointment.duration || 5)
  const [buttonColor, setButtonColor] = useState(theme.colors.primary)
  
  const onReset = () => (setChoosed(false), setDateMeta(initState))
  
  const setDate = (event, date) => {
    setButtonColor('green')
    setDateMeta((prev) => {
      const isDate = prev.mode === 'date'
      return {
        сurrent: prev.сurrent,
        date: isDate ? date : prev.date.setTime(date.getTime()), date,
        mode: isDate ? 'time' : null
      }
    })
  }

  const onSubmit = () => {

    if (dateMeta.date) {

      const content = { patientId: choosed.id, date: dateMeta.date, diagnosis, notes, duration }

      if(isEditMode) {
        return appointment.updateInstance(content).then(navigation.goBack)
      }

      return createAppointment(content).then(navigation.popToTop)
    } 

    setButtonColor('red')

  }

  return (
    <Container>
      {!choosed ? <Autocomplete 
        onChange={onSearch(db)} 
        renderList={renderList} 
        onChoose={setChoosed}
        placeholder="Поиск пациента"
      /> : (
        <>
          <Patient patient={choosed} />
          <Button 
            icon="reload" 
            mode="contained"
            onPress={onReset}
          >
            Выбрать другого
          </Button>
          <Button 
            style={{ marginTop: 40, borderColor: buttonColor }} 
            icon="calendar" 
            mode="outlined" 
            color={buttonColor}
            onPress={() => setDateMeta(prev => ({ ...prev, mode: 'date' }))}
          >
            {dateMeta.date ? formatRu(dateMeta.date, 'PPpp') : 'Выбрать дату'}
          </Button>
          <View style={{ marginTop: 20, marginLeft: 0 }}>
            <Text variant="headlineMedium">{`Длительность приема: ${duration} минут`}</Text>
            <Slider
              style={{width: '100%', height: 40}}
              onValueChange={setDuration}
              value={duration}
              step={5}
              minimumValue={5}
              maximumValue={120}
              minimumTrackTintColor={theme.colors.primary}
              thumbTintColor={theme.colors.primary}
              maximumTrackTintColor="#000000"
            />
          </View>
          <View style={{ marginTop: 20, marginLeft: 0 }}>
            <Input
              mode="outlined"
              label="Планируемые операции"
              style={{ marginTop: 12 }}
              onChangeText={setDiagnosis}
              value={diagnosis}
              multiline
            />
          </View>
          <View style={{ marginTop: 20, marginLeft: 0 }}>
            <Input
              mode="outlined"
              label="Заметки"
              style={{ marginTop: 12 }}
              onChangeText={setNotes}
              value={notes}
              multiline
            />
          </View>
          <View style={{ marginTop: 20, marginLeft: 0 }}>
            <TimeRow>
              <View style={{ flex: 1 }}>
                {dateMeta.mode && <DatePicker
                  mode={dateMeta.mode}
                  minimumDate={dateMeta.сurrent}
                  value={dateMeta.date || dateMeta.сurrent}
                  onChange={setDate}
                />}
              </View>
            </TimeRow>
          </View>
          <ButtonView>
            <Button 
              icon="plus-thick" 
              mode="contained" 
              color={theme.colors.primary} 
              onPress={onSubmit}
            >
              Добавить прием
            </Button>
          </ButtonView>
        </>
      )}
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

export default AddAppointment;
