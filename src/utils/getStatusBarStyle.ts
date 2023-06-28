import { StatusBarStyle } from "react-native"
import { AppTheme } from "../styles/themes"

type getStatusBarStyleParams = {
  isHome: boolean
  isModalOpen: boolean
  theme: AppTheme
}

type StatusBarResult = {
  statusBarColor: string;
  statusBarStyle: StatusBarStyle;
}

export const getStatusBarStyle = ({ 
  isHome,
  isModalOpen,
  theme
}: getStatusBarStyleParams) => {
  const res:StatusBarResult = { statusBarColor: 'black', statusBarStyle: 'light-content' }

  if(!isModalOpen) {
    res.statusBarColor = isHome ? theme.colors.surface : theme.colors.primary
    isHome && (res.statusBarStyle = 'dark-content')
  }
  
  return res
}

