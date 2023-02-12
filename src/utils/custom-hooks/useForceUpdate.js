import { useFocusEffect } from "@react-navigation/native"
import { useState, useEffect, useCallback } from "react"

const inverse = (s) => !s

export const useForceUpdate = (initState) => {
  const [s, set] = useState(initState)
  return [s, () => set(inverse)]
}

export const useForceUpdateByInterval = (delay, stop = false) => {
  const set = useState(false)[1]
  const render = () => set(inverse)

  useFocusEffect(
    useCallback(() => {
      render()
      
      const timer = !stop && setInterval(() => {
        render()
      }, delay)
  
      return () => clearInterval(timer)
    }, [stop])
  )

  return render
}
