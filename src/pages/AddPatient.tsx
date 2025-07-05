import { useState, useMemo, useEffect, FC } from "react"
import { View } from "react-native"
import { TextInput, Button, HelperText } from "react-native-paper"
import { PhoneInput } from "../components"
import { createPatient } from "../db/actions"
import { ScrollView } from "react-native-gesture-handler"
import { NavigationProp } from "@react-navigation/native"
import Patient from "../db/models/Patient"
import Phone from "../db/models/Phone"
import { PhoneInputTypes } from "../components/PhoneInput"
import { t } from "@lingui/core/macro"

const defObj = {}
const wrapper = { padding: 25, flex: 1 }

export type AddPatientProps = {
  navigation: NavigationProp<ReactNavigation.RootParamList>
  route: {
    params?: ReactNavigation.RootParamList['AddPatient']
  }
}

export type PhoneDTO = { id?: string, number: string, link: Phone, delete?: boolean }

const AddPatient: FC<AddPatientProps> = ({ navigation, route: { params } }) => {
  
  const patient: Patient | Record<string, never> = params?.patient || defObj
  const phones = params?.phones
  const isEditMode = Boolean(params?.patient)

  const [fullName, setName] = useState<string>(patient.fullName || '')
  const [error, setError] = useState('')

  useEffect(() => {
    if(error) {
      setError('')
    }
  }, [fullName])
  
  const sourceMap = useMemo(() => {
    if(!phones) return {}

    return phones.reduce<Record<string, PhoneDTO>>((acc, phone) => {
      acc[phone.id] = ({ id: phone.id, number: phone.number, link: phone })
      return acc
    }, {})

  }, [phones])

  const onChange: PhoneInputTypes['onChange'] = (key, value) => {
    if(value === null) {
      return delete sourceMap[key]
    }

    sourceMap[key] = (value as PhoneDTO)
  }

  const onSubmit = () => {

    if(!fullName) {
      return setError(t`Имя не может быть пустым`)
    }

    if(isEditMode && patient.updateInstance) {
      return (patient as unknown as Patient).updateInstance({ fullName }, Object.values(sourceMap)).then(navigation.goBack)
    }

    createPatient({ fullName, phones: Object.values(sourceMap) }, { withReturn: true }).then(patient => {
       
      // @ts-ignore
      navigation.replace('Detail', { patient })
    })
  }

  const hasError = Boolean(error)

  return (
    <ScrollView style={wrapper}>
      <View style={{ marginTop: 20, marginLeft: 0 }}>
        <TextInput
          mode="outlined"
          label={t`Имя`}
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
        buttonColor={isEditMode ? 'green' : undefined}
      >
        {isEditMode ? t`Сохранить изменения` : t`Добавить пациента`}
      </Button>
    </ScrollView>
  )
}

export default AddPatient
