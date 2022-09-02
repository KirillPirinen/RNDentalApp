import { useState } from "react";

export const useAutocomplete = ({
  initState
}) => {
  
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


}
