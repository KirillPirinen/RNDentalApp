import { useState } from 'react'
import { View, FlatList, Divider } from 'react-native'
import { Surface } from 'react-native-paper'
import styled from 'styled-components'
import DatePicker from '@react-native-community/datetimepicker'
import { Container, Autocomplete, Patient, EmptyList } from '../components'
import { Button, TextInput as Input, Text, useTheme, IconButton } from 'react-native-paper'
import { useDatabase } from '@nozbe/watermelondb/hooks'
import { Q } from '@nozbe/watermelondb';
import { useNavigation } from '@react-navigation/native'
import { useEffect } from 'react'

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

const AddAppointment = () => {
  const [dateMeta, setDateMeta] = useState({ mode: null, сurrent: new Date() })
  const [choosed, setChoosed] = useState(null)
  
  const theme = useTheme()
  const db = useDatabase()

  //useEffect(() => console.log(dateMeta), [dateMeta])
  
  const setDate = (event, date) => {
    setDateMeta((prev) => {
      const isDate = prev.mode === 'date'
      return {
        сurrent: prev.сurrent,
        date: isDate ? date : prev.date.setTime(date.getTime()), date,
        mode: isDate ? 'time' : null
      }
    })
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
            color="white"
            onPress={() => setChoosed(false)}
          >
            Выбрать другого
          </Button>
          <Button 
            style={{ marginTop: 40 }} 
            icon="calendar" 
            mode="contained" 
            color={theme.colors.primary} 
            onPress={() => setDateMeta(prev => ({ ...prev, mode: 'date' }))}
          >
            {dateMeta.date && 'Выбрать дату'}
          </Button>
          <View style={{ marginTop: 20, marginLeft: 0 }}>
            <Input
              mode="outlined"
              label="Планируемые операции"
              keyboardType="numeric"
              style={{ marginTop: 12 }}
            />
          </View>
          <View style={{ marginTop: 20, marginLeft: 0 }}>
          <IconButton
            icon="camera"
            size={20}
            onPress={() => setDateMeta(prev => ({ ...prev, mode: 'date' }))}
          />
            <TimeRow>
              <View style={{ flex: 1 }}>
                {dateMeta.mode && <DatePicker
                  mode={dateMeta.mode}
                  minimumDate={dateMeta.сurrent}
                  value={dateMeta.date || dateMeta.сurrent}
                  onChange={setDate}
                  timeZoneOffsetInMinutes={0}
                />}
              </View>
            </TimeRow>
          </View>
          <ButtonView>
            <Button icon="plus-thick" mode="contained" color={theme.colors.primary} onPress={() => console.log('Pressed')}>
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

const ListItemContent = styled(Text)`
  width:100%;
  padding-bottom: 10px;
  padding-top: 10px;
`

const ListWrapper = styled(Surface)`
  position: absolute;
  top: 49px;
  width: 100%;
  padding: 15px 20px;
  z-index: 100;
`

export default AddAppointment;
