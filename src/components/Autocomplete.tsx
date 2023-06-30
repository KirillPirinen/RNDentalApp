import { useState } from 'react'
import { Searchbar } from 'react-native-paper'
import { View } from 'react-native'
import { useEffect } from 'react'

const Autocomplete = <T extends { result: T['result']; searchQuery?: string; }>({
  placeholder, 
  renderList,
  onChange, 
  initState, 
  ...rest 
}: {
  placeholder?: string
  renderList: ((props: T) => JSX.Element) | React.ComponentType<T>
  onChange: (query: string) => Promise<T['result']> | T['result']
  initState?: T['result']
} & Omit<T, 'result' | 'searchQuery'>) => {

  const [result, setResult] = useState(initState);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setResult(initState)
  }, [initState])

  const onChangeSearch = (query: string) => {
    if(query) {
      const prepQuery = query.toLowerCase()
      const recieved = onChange(prepQuery)

      if (recieved instanceof Promise) {
        recieved.then(setResult)
      } else {
        setResult(recieved)
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
      {/* @ts-ignore */}
      <Output result={result} searchQuery={searchQuery} { ...rest } />
    </View>
  )
}

export default Autocomplete
