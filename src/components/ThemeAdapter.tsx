import themes, { AppTheme } from "../styles/themes"
import { Provider as PaperProvider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { FC, ReactNode } from "react"


const ThemeAdapter: FC<{ children: ReactNode }> = ({ children }) => {
  const currentThemeName = 'light'
  const theme = themes[currentThemeName] as AppTheme
  return (
    <PaperProvider theme={theme}>
      {/* @ts-ignore */}
      <NavigationContainer theme={theme}>
          {children}
      </NavigationContainer>
    </PaperProvider>
  )
}

export default ThemeAdapter
