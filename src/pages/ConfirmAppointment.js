import { useState } from 'react'
import { View, FlatList, Divider, ScrollView, StyleSheet } from 'react-native'
import DatePicker from '@react-native-community/datetimepicker'
import { Container, Autocomplete, Patient, EmptyList } from '../components'
import { Button, TextInput as Input, Text, useTheme } from 'react-native-paper'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import formatRu from '../utils/formatRu'
import { createAppointment } from '../db/actions'
import Slider from '@react-native-community/slider'
import { querySanitazer } from '../utils/sanitizers'
import { useModal } from '../context/modal-context'

const ConfirmAppointment = ({ navigation, route: { params } }) => {
  const [actions, dispatch] = useModal()

  const appointment = params?.appointment || {}
  const patient = params?.patient
  const confirmMode = params?.confirm

  const theme = useTheme()

  const [notes, setNotes] = useState(appointment.notes || '')
  const [diagnosis, setDiagnosis] = useState('')
  const [price, setPrice] = useState('')
  const [teeth, setTeeth] = useState('')
  const [duration, setDuration] = useState(appointment.duration)

  const onChooseTeeth = () => dispatch({ type: actions.CHOOSE_TEETH })
  

  const onSubmit = () => {

  }

  return (
    <Container>
        <ScrollView keyboardShouldPersistTaps='handled'>
          <Patient 
            patient={patient} 
            theme={theme}
            onPress={() =>  navigation.navigate('Detail', { patient })}
          />
          <Button 
            style={{ marginTop: 40, borderColor: theme.colors.primary }} 
            icon="tooth-outline" 
            mode="outlined" 
            onPress={onChooseTeeth}
            disabled={confirmMode}
          >
            Выбрать зубы
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
              disabled={confirmMode}
            />
          </View>
          <View style={styles.middleWrapper}>
            <Input
              mode="outlined"
              label="Диагноз"
              style={styles.input}
              onChangeText={setDiagnosis}
              value={diagnosis}
              multiline
              disabled={confirmMode}
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
              disabled={confirmMode}
            />
          </View>
          <View style={styles.middleWrapper}>
            <Input
              mode="outlined"
              label="Цена"
              style={styles.input}
              onChangeText={setPrice}
              value={price}
              keyboardType="number-pad"
              disabled={confirmMode}
            />
          </View>
          <View style={styles.buttonView}>
            <Button 
              icon="plus-thick" 
              mode="contained" 
              color="green"
              onPress={() => void 0}
            >
              Подтвердить прием
            </Button>
          </View>
        </ScrollView>
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

export default ConfirmAppointment
