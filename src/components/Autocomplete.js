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
        recieved.then(setResult)
      } else {
        setResult(onChange(prepQuery))
      }
      
    } else {
      setResult(initState)
    }
    setSearchQuery(query)
  }

  const Output = renderList

  return (
    <View>
      <Searchbar
        placeholder={placeholder}
        onChangeText={onChangeSearch}
        value={searchQuery}
      />
      <Output {...rest} result={result} searchQuery={searchQuery} />
    </View>
  )
}
