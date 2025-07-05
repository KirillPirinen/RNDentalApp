import { ReactNode, useState } from 'react'
import { Searchbar } from 'react-native-paper'
import { StyleProp, View, ViewStyle } from 'react-native'
import { useEffect } from 'react'
import { querySanitazer } from '../utils/sanitizers'

const Autocomplete = <T extends { result: T['result']; searchQuery?: string; }, F>({
  placeholder, 
  renderList,
  onChange, 
  initState,
  barStyle,
  children,
  onFocus,
  style,
  ...rest 
}: {
  placeholder?: string
  renderList: ((props: T) => JSX.Element) | React.ComponentType<T>
  onChange: (query: string) => Promise<T['result']> | T['result']
  initState?: Promise<T['result']> | T['result']
  barStyle?: object
  children?: ReactNode
  onFocus?: () => void
  style?: StyleProp<ViewStyle>
} & Omit<T, 'result' | 'searchQuery'>) => {

  const [result, setResult] = useState<T['result']>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const init = () => {
    if (initState instanceof Promise) {
      initState.then(setResult)
    } else {
      setResult(initState)
    }
  }

  useEffect(() => {
    if(!searchQuery) {
      init()
    } else {
      onChangeSearch(searchQuery)
    }
  }, [initState])

  const onChangeSearch = (query: string) => {
    if(query) {
      const prepQuery = querySanitazer(query)
      const recieved = onChange(prepQuery)

      if (recieved instanceof Promise) {
        recieved.then(setResult)
      } else {
        setResult(recieved)
      }
      
    } else {
      init()
    }
    setSearchQuery(query)
  }

  const Output = renderList

  return (
    <View style={style}>
      <Searchbar
        placeholder={placeholder}
        onChangeText={onChangeSearch}
        style={barStyle}
        value={searchQuery}
        onFocus={onFocus}
      />
      {children}
      {/* @ts-ignore */}
      <Output result={result} searchQuery={searchQuery} { ...rest } />
    </View>
  )
}

export default Autocomplete
