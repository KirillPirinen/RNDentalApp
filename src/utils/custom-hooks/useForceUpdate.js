import { useState, useEffect } from "react"

const inverse = (s) => !s

export const useForceUpdate = (timer) => {
  const set = useState(false)[1]
  return () => set(inverse)
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
