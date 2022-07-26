import { useState } from 'react'
import { Searchbar, Surface, Divider, Text } from 'react-native-paper'
import styled from 'styled-components/native'
import { TouchableOpacity } from 'react-native'
import { FlatList, View } from 'react-native'

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    name: 'Петров Петька',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    name: 'Иванов Ванька',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    name: 'Юля Дмитриева',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d12',
    name: 'John Doe',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d16',
    name: 'Vin Diesel1',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d17',
    name: 'Vin Diesel2',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d18',
    name: 'Vin Diesel3',
  },
];

export default () => {

  const [result, setResult] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const onChangeSearch = query => {
    if(query) {
      setResult(DATA.filter((patient) => patient.name.includes(query)))
    } else {
      setResult()
    }
    setSearchQuery(query)
  }

  const onSelect = (item) => () => {
    setSearchQuery(item.name)
    setResult()
  }

  return (
    <View style={{ marginLeft: 0 }} floatingLabel>
      <Searchbar
        placeholder="Пациент"
        onChangeText={onChangeSearch}
        value={searchQuery}
      />
      {result && <ListWrapper elevation={3}>
        { result.length ? <FlatList
          data={result}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={onSelect(item)}>
              <ListItemContent>{item.name}</ListItemContent>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={Divider}
        /> : <ListItemContent>Ничего не найдено</ListItemContent>}
      </ListWrapper>}
    </View>
  )
}

const ListItemContent = styled(Text)`
  width:100%;
  padding-bottom: 10px;
  padding-top: 10px;
`

const ListWrapper = styled(Surface)`
  position: absolute;
  top:49px;
  width: 100%;
  padding: 15px 20px;
  z-index: 2;
`
