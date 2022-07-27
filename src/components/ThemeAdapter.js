import themes from "../styles/themes"
import { useSelector } from "react-redux"
import { getCurrentTheme } from "../redux/themeSlice"
import { Provider as PaperProvider } from 'react-native-paper'

export default ({ children }) => {
  const currentThemeName = useSelector(getCurrentTheme)
  return <PaperProvider theme={themes[currentThemeName]}>{children}</PaperProvider>
}
