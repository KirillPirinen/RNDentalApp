import { FC, useCallback, useEffect, useState } from 'react'
import { FlatList } from 'react-native'
import { Autocomplete, Patient, EmptyList } from '../../components'
import { Button, Divider, Text } from 'react-native-paper'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import { Q } from '@nozbe/watermelondb'
import { useNavigation } from '@react-navigation/native'
import { querySanitazer } from '../../utils/sanitizers'
import { defaultExtractor } from '../../utils/defaultFn'
import { useGeneralControl } from '../../context/general-context'
import { getScheduledPatiens } from '../../db/raw-queries'
import { HighlightedText } from '../../components/HighlightedText'
import { PatientPhones } from '../../components/PatientPhones'
import PatientModel from '../../db/models/Patient'
import { useAppTheme } from '../../styles/themes'
import { usePatients } from '../../utils/custom-hooks/usePatients'
import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'

const renderList = ({ result, onChoose, searchQuery: searchQueryRaw }: {
  result: Array<PatientModel>;
  onChoose: (p: PatientModel) => void;
  searchQuery: string;
}) => {
  const db = useDatabase()
  const navigation = useNavigation()
  const theme = useAppTheme()
  const [actions, dispatch] = useGeneralControl()
  const searchQuery = querySanitazer(searchQueryRaw)
  const [suggestions, setSuggestions] = useState<Array<PatientModel>>([])

  useEffect(() => {
    db.get<PatientModel>('patients').query(getScheduledPatiens()).then(data => {
      const dict: Record<string, boolean> = {}
      const res = []
      for(const patient of data) {
        if(!dict[patient.id]) {
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

  const isSearching = Boolean(result)
  const hasSuggestions = Boolean(suggestions.length)

  return (
    <FlatList
      data={isSearching ? result : suggestions}
      keyExtractor={defaultExtractor}
      renderItem={({ item }) => (
        <Patient
          patient={item} 
          navigation={navigation} 
          theme={theme}
          renderName={(name) => <HighlightedText text={name} query={searchQuery} />}
          onPress={() => onChoose(item)}
          onLongPress={() => navigation.navigate('Detail', { patient: item })}
        >
          <PatientPhones patient={item} query={searchQuery} />
        </Patient>
      )}
      ItemSeparatorComponent={Divider}
      style={{ marginVertical: 12 }}
      ListHeaderComponent={(!isSearching && hasSuggestions) ? <Text variant="titleMedium"><Trans>Последние запланированные пациенты</Trans>: </Text> : undefined}
      ListFooterComponent={(isSearching && !result?.length) ? (
        <EmptyList text={t`Пациент не найден. Хотите добавить нового?`}>
          <Button 
            icon="plus" 
            mode="outlined"
            buttonColor={theme.colors.primaryContainer}
            textColor="white"
            onPress={onChoosePatientMethod}
            style={{ marginVertical: 10 }}
          >
            <Trans>Добавить</Trans>
          </Button>
        </EmptyList>
      ) : undefined}
    />
  )
}

export type PatientSearchProps = {
  setChoosed: (patient: PatientModel) => void;
  barStyle?: object;
}

const PatientSearch: FC<PatientSearchProps> = ({ setChoosed, barStyle }) => {
  const patients = usePatients()
  const db = useDatabase()

  const onSearch = useCallback(async (query: string) => {
    if(/^\d/.test(query)) {
      return await db.get<PatientModel>('patients').query(
        Q.experimentalJoinTables(['phones']),
        Q.on('phones', 'number', Q.like(`%${query}%`))
      ).fetch()
    }
    
    return patients.filter(patient => patient.fullName.toLowerCase().includes(query.toLowerCase()))
  }, [patients, db])

  return (
    <Autocomplete 
      onChange={onSearch} 
      renderList={renderList}
      onChoose={setChoosed}
      placeholder={t`Поиск пациента`}
      barStyle={barStyle}
    />
  )
}

export default PatientSearch
