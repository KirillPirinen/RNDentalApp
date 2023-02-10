import { useState, useEffect } from "react"

const inverse = (s) => !s

export const useForceUpdate = (initState) => {
  const [s, set] = useState(initState)
  return [s, () => set(inverse)]
}

export const useForceUpdateByInterval = (delay) => {
  const set = useState(false)[1]
  const cb = () => set(inverse)

  useEffect(() => {

    const timer = setInterval(() => cb(), delay)

    return () => clearInterval(timer)

  }, [])

  return cb
}
