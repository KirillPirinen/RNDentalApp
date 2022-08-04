import themes from "../styles/themes"
import { Provider as PaperProvider } from 'react-native-paper'

export default ({ children }) => {
  const currentThemeName = 'light'
  return <PaperProvider theme={themes[currentThemeName]}>{children}</PaperProvider>
}
