import { useCallback, useRef } from "react"
import { noop } from "../noop"

export const useSafeRefCB = () => useRef(noop)

export const useFabControlsRef = () => {
  const ref = useSafeRefCB()
  return [
    ref,
    () => ref.current(true),
    () => ref.current(false)
  ]

}
