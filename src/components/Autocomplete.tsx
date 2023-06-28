import { useState } from 'react'
import { Searchbar } from 'react-native-paper'
import { View } from 'react-native'
import { useEffect } from 'react'

type RenderListDefaultProps<I> = {
  result: Array<I>
  searchQuery: string;
}

const Autocomplete = <I extends object, T extends RenderListDefaultProps<I>>({
  placeholder, 
  renderList, 
  onChange, 
  initState, 
  ...rest 
}: {
  placeholder: string
  renderList: (props:T) => JSX.Element
  onChange: (query: string) => Promise<Array<I>> | Array<I>
  initState: Array<I>
}) => {

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

  return (
    <View>
      <Searchbar
        placeholder={placeholder}
        onChangeText={onChangeSearch}
        value={searchQuery}
      />
      {renderList({ result, searchQuery, ...rest } as T)}
    </View>
  )
}

export default Autocomplete
