import { useMemo, useRef } from "react"
import { noop } from "../noop"

export const useSafeRefCB = () => useRef(noop)

export const useFabControlsRef = () => {
  const ref = useSafeRefCB()
  return useMemo<[ReturnType<typeof useSafeRefCB>, typeof noop, typeof noop]>(() => [
    ref,
    () => ref.current(true),
    () => ref.current(false)
  ], [])
}
