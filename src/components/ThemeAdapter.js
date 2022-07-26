import themes from "../styles/themes"
import { useSelector } from "react-redux"
import { ThemeProvider } from "styled-components/native"
import { getCurrentTheme } from "../redux/themeSlice"

export default ({ children }) => {
  const currentThemeName = useSelector(getCurrentTheme)
  return <ThemeProvider theme={themes[currentThemeName]}>{children}</ThemeProvider>
}
