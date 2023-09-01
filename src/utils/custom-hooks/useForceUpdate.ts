import { useFocusEffect } from "@react-navigation/native"
import { useCallback, useReducer } from "react"

const inverse = (s: boolean) => !s

export const useForceUpdate = (initState?: boolean) => useReducer(inverse, Boolean(initState));

export const useForceUpdateByInterval = (delay: number, stop = false) => {
  const render = useForceUpdate()[1]

  useFocusEffect(
    useCallback(() => {
      render()
      let rqid: number;

      const timer = !stop && setInterval(() => {
        rqid && cancelIdleCallback(rqid)
        rqid = requestIdleCallback(render)
      }, delay)
  
      return () => {
        timer && clearInterval(timer)
        rqid && cancelIdleCallback(rqid)
      }
    }, [stop])
  )

  return render
}
