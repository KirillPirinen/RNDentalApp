import { useState } from 'react'
import { Searchbar } from 'react-native-paper'
import { View } from 'react-native'
import { useEffect } from 'react'

export default ({ placeholder, renderList, onChange, initState, ...rest }) => {

  const [result, setResult] = useState(initState);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setResult(initState)
  }, [initState])

  const onChangeSearch = query => {
    if(query) {
      const prepQuery = query.toLowerCase()
      const recieved = onChange(prepQuery)

      if (recieved instanceof Promise) {
        recieved.then(data => setResult(data))
      } else {
        setResult(onChange(prepQuery))
      }
      
    } else {
      setResult(initState)
    }
    setSearchQuery(query)
  }

  const onSelectItem = () => () => {
    setSearchQuery(text)
    setResult()
  }

  const Output = renderList

  return (
    <View>
      <Searchbar
        placeholder={placeholder}
        onChangeText={onChangeSearch}
        value={searchQuery}
      />
      <Output {...rest} onSelect={onSelectItem} result={result} />
    </View>
  )
}
