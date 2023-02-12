import { useCallback, useEffect, useState } from 'react'
import { View, FlatList, Divider, ScrollView, StyleSheet } from 'react-native'
import DatePicker from '@react-native-community/datetimepicker'
import { Container, Autocomplete, Patient, EmptyList } from '../components'
import { Button, TextInput as Input, Text, useTheme } from 'react-native-paper'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import { Q } from '@nozbe/watermelondb'
import { useNavigation } from '@react-navigation/native'
import formatRu from '../utils/formatRu'
import { createAppointment } from '../db/actions'
import Slider from '@react-native-community/slider'
import { querySanitazer } from '../utils/sanitizers'
import { defaultExtractor } from '../utils/defaultFn.js'
import { useModal } from '../context/modal-context'
import { getScheduledPatiens } from '../db/raw-queries.js'

const onSearch = (db) => async (query) => {
  const sanitized = querySanitazer(query)
  return db.get('patients').query(Q.where('full_name', Q.like(`%${sanitized}%`)))
}

const renderList = ({ result, onChoose, db }) => {
  const navigation = useNavigation()
  const theme = useTheme()
  const [actions, dispatch] = useModal()

  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    db.get('patients').query(getScheduledPatiens()).then(data => {
      const dict = {}
      const res = []
      for(const patient of data) {
        if(!dict.hasOwnProperty(patient.id)) {
          res.push(patient)
          dict[patient.id] = true
          if(res.length >= 3) break
        }
      }
      setSuggestions(res)
    })
  }, [])

  const onChoosePatientMethod = () => dispatch({ 
    type: actions.CHOOSE_ADD_PATIENT_METHOD,
    payload: { 
      onAlone: () => navigation.navigate('AddPatient'), 
      onBulk: () => navigation.navigate('ImportContacts')  
    }
  })

  const renderItem = useCallback(({ item }) => <Patient
    theme={theme}
    patient={item}
    onPress={() => onChoose(item)}
    onLongPress={() => navigation.navigate('Detail', { patient: item })}
  />, [onChoose])

  const isSearching = Boolean(result)
  const hasSuggestions = Boolean(suggestions.length)

  return (
    <FlatList
      data={isSearching ? result : suggestions}
      keyExtractor={defaultExtractor}
      renderItem={renderItem}
      ItemSeparatorComponent={Divider}
      style={{ marginVertical: 12 }}
      ListHeaderComponent={!isSearching && hasSuggestions && <Text variant="titleMedium">Последние запланированные пациенты: </Text>}
      ListFooterComponent={isSearching && !result.length && (
        <EmptyList text="Пациент не найден. Хотите добавить нового?">
          <Button 
            icon="plus" 
            mode="outlined"
            buttonColor={theme.colors.primaryContainer}
            textColor="white"
            onPress={onChoosePatientMethod}
            style={{ marginVertical: 10 }}
          >
            Добавить
          </Button>
        </EmptyList>
      )}
    />
  )
}

const initState = { mode: null, сurrent: new Date() }

const AddAppointment = ({ navigation, route: { params } }) => {

  const appointment = params?.appointment || {}
  const patient = params?.patient
  const confirmMode = params?.appointment?.isConfirmed
  const isEdit = params?.edit

  const theme = useTheme()
  const db = useDatabase()

  const [dateMeta, setDateMeta] = useState(appointment.date ? 
    {...initState, date: appointment.date } : initState
  )

  const [choosed, setChoosed] = useState(patient || null)
  const [notes, setNotes] = useState(appointment.notes || '')
  const [duration, setDuration] = useState(appointment.duration || 5)
  const [buttonColor, setButtonColor] = useState(theme.colors.primary)

  const onReset = () => setChoosed(null)
  
  const setDate = (event, date) => {
    setDateMeta((prev) => {
      const isDate = prev.mode === 'date'
      return {
        сurrent: prev.сurrent,
        date: isDate ? date : prev.date.setTime(date.getTime()), date,
        mode: isDate ? 'time' : null
      }
    })
    setButtonColor('green')
  }

  useEffect(() => {
    if(patient && !choosed) {
      setChoosed(patient)
    }
  }, [patient])

  const onSubmit = () => {

    if (dateMeta.date) {

      const content = { patientId: choosed.id, date: dateMeta.date, notes, duration }

      if(params?.edit) {
        return appointment.updateInstance(content).then(navigation.goBack)
      }

      return createAppointment(content).then(navigation.goBack)
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
        db={db}
      /> : (
        <ScrollView keyboardShouldPersistTaps='handled'>
          <Patient 
            patient={choosed} 
            theme={theme}
            onPress={choosed && function(){ navigation.navigate('Detail', { patient: choosed })}}
          />
          <Button 
            icon="reload" 
            mode="contained"
            onPress={onReset}
            style={{
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0
            }}
            disabled={confirmMode}
          >
            Выбрать другого
          </Button>
          <Button 
            style={{ marginTop: 40, borderColor: buttonColor }} 
            icon="calendar" 
            mode="outlined" 
            textColor={buttonColor}
            onPress={() => setDateMeta(prev => ({ ...prev, mode: 'date' }))}
          >
            {dateMeta.date ? formatRu(dateMeta.date, 'PPpp') : 'Выбрать дату'}
          </Button>
          <View style={styles.middleWrapper}>
            <Text variant="titleLarge">{`Длительность приема: ${duration} минут`}</Text>
            <Slider
              style={styles.slider}
              onValueChange={setDuration}
              onSlidingComplete={setDuration}
              value={duration}
              step={5}
              minimumValue={5}
              maximumValue={120}
              minimumTrackTintColor={theme.colors.primary}
              thumbTintColor={theme.colors.primary}
              maximumTrackTintColor="#000000"
            />
          </View>
          <View style={styles.middleWrapper}>
            <Input
              mode="outlined"
              label="Заметки"
              style={styles.input}
              onChangeText={setNotes}
              value={notes}
              multiline
            />
          </View>
          <View style={styles.middleWrapper}>
            <View style={styles.timeRow}>
              <View style={styles.flex}>
                {dateMeta.mode && (
                  <DatePicker
                    mode={dateMeta.mode}
                    minimumDate={dateMeta.сurrent}
                    value={dateMeta.date || dateMeta.сurrent}
                    onChange={setDate}
                  />
                )}
              </View>
            </View>
          </View>
          <View style={styles.buttonView}>
            <Button 
              icon="plus-thick" 
              mode="contained" 
              color={theme.colors.primary} 
              onPress={onSubmit}
            >
              {isEdit ? 'Сохранить изменения' : 'Добавить прием'}
            </Button>
          </View>
        </ScrollView>
      )}
    </Container>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  slider: { width: '100%', height: 40 }, 
  buttonView: {
    flex: 1,
    marginTop: 30
  },
  timeRow: {
    flexDirection: 'row'
  },
  middleWrapper: { marginTop: 20, marginLeft: 0 },
  input: { marginTop: 12 }
})

export default AddAppointment
