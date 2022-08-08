import { useState } from "react"

export const useForceUpdate = () => {
  const set = useState(false)[1]
  return () => set((s) => !s)
}
