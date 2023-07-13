import { useIsFocused } from "@react-navigation/native"

export const widthUnmounOnBlur = <P extends object>(Component: React.ComponentType<P>) => (props: P) => {
  const isFocused = useIsFocused()

  return isFocused ? <Component {...props} /> : null
}
