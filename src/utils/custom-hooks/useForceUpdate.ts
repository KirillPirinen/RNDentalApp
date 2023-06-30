import { useFocusEffect } from "@react-navigation/native"
import { useCallback, useReducer } from "react"

const inverse = (s: boolean) => !s

export const useForceUpdate = (initState?: boolean) => useReducer(inverse, Boolean(initState));

export const useForceUpdateByInterval = (delay: number, stop = false) => {
  const render = useForceUpdate()[1]

  useFocusEffect(
    useCallback(() => {
      render()
      
      const timer = !stop && setInterval(() => {
        render()
      }, delay)
  
      return () => timer && clearInterval(timer)
    }, [stop])
  )

  return render
}
