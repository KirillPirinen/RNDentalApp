import { useState } from "react"
import { View } from "react-native"
import { TextInput, Button } from "react-native-paper"
import { Container } from "../components"
import { createPatient } from "../db/actions"

export default ({ navigation, route: { params } }) => {

  const patient = params?.patient || {}
  const isEditMode = Boolean(params?.patient)

  const [fname, setFirst] = useState(patient.fname || '')
  const [lname, setLast] = useState(patient.lname || '')
  const [phone, setPhone] = useState(patient.phone || '')

  const onClick = () => {
    if(isEditMode) {
      return patient.updateInstance({ fname, lname, phone }).then(navigation.goBack)
    }
    createPatient({ fname, lname, phone }).then(patient => {
      navigation.replace('Detail', { patient })
    })
  }

  return (
    <Container>
      <View style={{ marginTop: 20, marginLeft: 0 }} floatingLabel>
        <TextInput
          mode="outlined"
          label="Имя"
          style={{ marginTop: 12 }}
          onChangeText={setFirst}
          value={fname}
        />
      </View>
      <View style={{ marginTop: 20, marginLeft: 0 }} floatingLabel>
        <TextInput
          mode="outlined"
          label="Фамилия"
          style={{ marginTop: 12 }}
          onChangeText={setLast}
          value={lname}
        />
      </View>
      <View style={{ marginTop: 20, marginLeft: 0 }} floatingLabel>
        <TextInput
          mode="outlined"
          label="Телефон"
          style={{ marginTop: 12 }}
          keyboardType="phone-pad"
          onChangeText={setPhone}
          value={phone}
        />
      </View>
        <Button 
          style={{ marginTop: 30 }} 
          icon="plus-thick" 
          mode="contained" 
          onPress={onClick}
          color={isEditMode && 'green'}
        >
          {isEditMode ? 'Редактировать данные' : 'Добавить пациента'}
        </Button>
    </Container>
  )
}
