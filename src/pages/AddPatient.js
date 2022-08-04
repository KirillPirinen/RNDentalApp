import { useState } from "react"
import { View } from "react-native"
import { TextInput, Button } from "react-native-paper"
import { Container } from "../components"
import { createPatient, createPatients2 } from "../db/actions/patient.actions"

export default () => {
  
  const [fname, setFirst] = useState('')
  const [lname, setLast] = useState('')
  const [phone, setPhone] = useState('')

  const onClick = () => {
    createPatients2(fname, lname, phone)
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
      >
        Добавить прием
      </Button>
    </Container>
  )
}
