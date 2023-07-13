import { FC, useState } from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'
import { Container, Patient } from '../components'
import { Button, TextInput as Input, Text } from 'react-native-paper'
import Slider from '@react-native-community/slider'
import { useGeneralControl } from '../context/general-context'
import { NavigationProp } from '@react-navigation/native'
import { useAppTheme } from '../styles/themes'

type ConfirmAppointmentProps = {
  navigation: NavigationProp<ReactNavigation.RootParamList>
  route: { params: ReactNavigation.RootParamList['ConfirmAppointment'] }
}

const ConfirmAppointment: FC<ConfirmAppointmentProps> = ({ navigation, route: { params } }) => {
  const [actions, dispatch] = useGeneralControl()

  const appointment = params?.appointment
  const patient = params?.patient

  const theme = useAppTheme()

  const [notes, setNotes] = useState(appointment?.notes)
  const [diagnosis, setDiagnosis] = useState(appointment?.diagnosis)
  const [price, setPrice] = useState(String(appointment?.price))
  const [teeth, setTeeth] = useState(appointment?.teeth?.split(',') || [])
  const [duration, setDuration] = useState(appointment?.duration)

  const onOpenSelection = () => dispatch({ 
    type: actions.CHOOSE_TEETH, 
    payload: { onSubmit:setTeeth, teeth } 
  })

  const onSubmit = () => {
    appointment?.updateInstance({ 
      notes, diagnosis, price: parseInt(price), duration, isConfirmed: true 
    }, teeth).then(navigation.goBack)
  }

  return (
    <Container>
        <ScrollView keyboardShouldPersistTaps='handled'>
          {patient && <Patient
            navigation={navigation}
            patient={patient} 
            theme={theme}
            onPress={() =>  navigation.navigate('Detail', { patient })}
          />}
          <Button 
            style={{ marginTop: 40, borderColor: theme.colors.primary }} 
            icon="tooth-outline" 
            mode="outlined" 
            onPress={onOpenSelection}
          >
            {teeth.toString() || 'Выбрать зубы'}
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
              label="Диагноз"
              style={styles.input}
              onChangeText={setDiagnosis}
              value={diagnosis}
              multiline
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
            <Input
              mode="outlined"
              label="Цена"
              style={styles.input}
              onChangeText={setPrice}
              value={price}
              keyboardType="number-pad"
            />
          </View>
          <View style={styles.buttonView}>
            <Button 
              icon="plus-thick" 
              mode="contained" 
              buttonColor="green"
              onPress={onSubmit}
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
