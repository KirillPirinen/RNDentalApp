import { useEffect, useRef } from "react"

export const useDebouncedCallback = (callback, delay) => {
  const argsRef = useRef()
  const timeout = useRef()

  const reset = () => {
    if(timeout.current) {
      clearTimeout(timeout.current)
    }
  }

  useEffect(() => reset, [])

  return (...args) => {
    argsRef.current = args

    reset()

    timeout.current = setTimeout(() => {
      if(argsRef.current) {
        callback(...argsRef.current)
      }
    }, delay)
  }
}
