import { useState } from 'react'
import { Searchbar, Surface, Divider, Text } from 'react-native-paper'
import styled from 'styled-components/native'
import { TouchableOpacity } from 'react-native'
import { FlatList, View } from 'react-native'

const DefaultList = ({ result, onSelect }) => (
    <>
      {result && (
        <ListWrapper elevation={3}>
          {result.length ? <FlatList
            data={result}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={onSelect(item)}>
                <ListItemContent>{item.name}</ListItemContent>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={Divider}
          /> : <ListItemContent>Ничего не найдено</ListItemContent>}
        </ListWrapper>
      )}
    </>
  )

export default ({ placeholder, renderList, onChange, onSelect, initState }) => {

  const [result, setResult] = useState(initState);
  const [searchQuery, setSearchQuery] = useState('');

  const onChangeSearch = query => {
    if(query) {
      const prepQuery = query.toLowerCase()
      setResult(onChange(prepQuery))
    } else {
      setResult()
    }
    setSearchQuery(query)
  }

  const onSelectItem = (item) => () => {
    setSearchQuery(item.name)
    setResult()
    onSelect?.()
  }

  const Output = renderList || DefaultList

  return (
    <View>
      <Searchbar
        placeholder={placeholder}
        onChangeText={onChangeSearch}
        value={searchQuery}
      />
      <Output onSelect={onSelectItem} result={result} />
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
  top: 49px;
  width: 100%;
  padding: 15px 20px;
  z-index: 100;
`
