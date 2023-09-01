import { FC, useEffect, useState } from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'
import DatePicker from '@react-native-community/datetimepicker'
import { Container, Patient } from '../components'
import { Button, TextInput as Input, Text } from 'react-native-paper'
import { NavigationProp } from '@react-navigation/native'
import formatRu from '../utils/formatRu'
import { createAppointment } from '../db/actions'
import Slider from '@react-native-community/slider'
import PatientModel from '../db/models/Patient'
import { useAppTheme } from '../styles/themes'
import Appointment from '../db/models/Appointment'
import PatientSearch from '../widgets/PatientSearch'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import { getAppointmentsWithCollision } from '../db/raw-queries'
import { useGeneralControl } from '../context/general-context'

const initState = { mode: null, сurrent: new Date() }

type DateMeta = { сurrent: Date; mode: null | 'date' | 'time'; date?: Appointment['date'] }

export type AddAppointmentProps = {
  navigation: NavigationProp<ReactNavigation.RootParamList>
  route: { params?: { patient: PatientModel, appointment?: Appointment, edit?: boolean } }
}

const AddAppointment: FC<AddAppointmentProps> = ({ navigation, route: { params } }) => {

  const appointment: Appointment | Record<string, never> = params?.appointment || {}
  const patient = params?.patient
  const confirmMode = params?.appointment?.isConfirmed
  const isEdit = params?.edit

  const theme = useAppTheme()
  const db = useDatabase()

  const [dateMeta, setDateMeta] = useState<DateMeta>(appointment.date ? 
    {...initState, date: appointment.date } : initState
  )

  const [choosed, setChoosed] = useState<PatientModel | null>(patient || null)
  const [notes, setNotes] = useState(appointment.notes || '')
  const [duration, setDuration] = useState(appointment.duration || 5)
  const [buttonColor, setButtonColor] = useState(theme.colors.primary)
  const [actions, dispatch] = useGeneralControl()

  const onReset = () => setChoosed(null)
  
  const setDate = (event: any, date?: Date) => {
    if(!date) return;
    setDateMeta((prev) => {
      const isDate = prev.mode === 'date'
      return {
        сurrent: prev.сurrent,
        // Пикер может быть с mode === time только после установки prev.date
        date: isDate ? date : (prev.date!.setTime(date.getTime()), date),
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

  const onSubmit = async () => {

    if (dateMeta.date && choosed) {
      const content = { patientId: choosed.id, date: dateMeta.date, notes, duration }

      const onSuccess = () => {
        if(params?.edit) {
          return appointment.updateInstance(content).then(navigation.goBack)
        }
  
        return createAppointment(content).then(navigation.goBack)
      }

      const overlappedCount = await db.get<Appointment>('appointments').query(getAppointmentsWithCollision(
        dateMeta.date,
        duration,
        appointment.id
      )).fetchIds()

      
      if (overlappedCount.length) {
        dispatch({ 
          type: actions.CONFIRM_COMMON, 
          payload: {
            title: `Обнаружено ${overlappedCount.length} записей на это время.`,
            question: 'Вы уверены что хотите записать пациента с пересечением?',
            buttons: [
            { 
              children: 'Выбрать другое время', 
              onPress: () => {
                dispatch({ type: actions.CLEAR })
                setDateMeta(appointment.date ? 
                  {...initState, date: appointment.date } : initState
                )
              }
            },
            { 
              children: 'Подтвердить', 
              onPress: onSuccess
            }
          ]
          }
        })
      } else {
        onSuccess()
      }
    } 

    setButtonColor('red')

  }

  return (
    <Container>
      {!choosed ? <PatientSearch setChoosed={setChoosed} /> : (
        <ScrollView keyboardShouldPersistTaps='handled'>
          <Patient 
            patient={choosed}
            navigation={navigation}
            theme={theme}
            onPress={choosed && (() => { navigation.navigate('Detail', { patient: choosed })})}
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
