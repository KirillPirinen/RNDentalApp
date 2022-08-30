import themes from "../styles/themes"
import { Provider as PaperProvider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'

export default ({ children }) => {
  const currentThemeName = 'light'
  return (
    <PaperProvider theme={themes[currentThemeName]}>
      <NavigationContainer theme={themes[currentThemeName]}>
          {children}
      </NavigationContainer>
    </PaperProvider>
  )
}
