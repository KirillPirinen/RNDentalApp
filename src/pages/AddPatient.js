import { useState, useMemo, useEffect } from "react"
import { View } from "react-native"
import { TextInput, Button, HelperText } from "react-native-paper"
import { PhoneInput } from "../components"
import { createPatient } from "../db/actions"
import { ScrollView } from "react-native-gesture-handler"

const defObj = {}
const wrapper = { padding: 25, flex: 1 }

const AddPatient = ({ navigation, route: { params } }) => {
  
  const patient = params?.patient || defObj
  const phones = params?.phones
  const isEditMode = Boolean(params?.patient)

  const [fullName, setName] = useState(patient.fullName || '')
  const [error, setError] = useState('')

  useEffect(() => {
    if(error) {
      setError('')
    }
  }, [fullName])
  
  const sourceMap = useMemo(() => {
    if(!phones) return {}

    return phones.reduce((acc, phone) => {
      acc[phone.id] = ({ id: phone.id, number: phone.number, link: phone })
      return acc
    }, {})

  }, [phones])

  const onChange = (key, value) => {
    if(value === null) {
      return delete sourceMap[key]
    }

    sourceMap[key] = value
  }

  const onSubmit = () => {

    if(!fullName) {
      return setError('Имя не может быть пустым')
    }

    if(isEditMode) {
      return patient.updateInstance({ fullName }, Object.values(sourceMap)).then(navigation.goBack)
    }

    createPatient({ fullName, phones: Object.values(sourceMap) }, { withReturn: true }).then(patient => {
      navigation.replace('Detail', { patient })
    })
  }

  const hasError = Boolean(error)

  return (
    <ScrollView style={wrapper}>
      <View style={{ marginTop: 20, marginLeft: 0 }} floatingLabel>
        <TextInput
          mode="outlined"
          label="Имя"
          style={{ marginTop: 12 }}
          onChangeText={setName}
          value={fullName}
          error={hasError}
        />
        <HelperText type="error" visible={hasError}>{error}</HelperText>
      </View>
      <PhoneInput onChange={onChange} phones={sourceMap} />
      <Button 
        style={{ marginTop: 30 }} 
        icon="plus-thick" 
        mode="contained" 
        onPress={onSubmit}
        buttonColor={isEditMode && 'green'}
      >
        {isEditMode ? 'Сохранить изменения' : 'Добавить пациента'}
      </Button>
    </ScrollView>
  )
}

export default AddPatient
