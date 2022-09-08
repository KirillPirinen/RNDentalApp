import { useRef } from "react"
import { noop } from "../noop"

export const useSafeRefCB = () => {
  const ref = useRef(noop)
  return ref
}
