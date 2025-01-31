import { MD3LightTheme, MD3DarkTheme, useTheme } from 'react-native-paper';

const light = {
  ...MD3LightTheme,
  roundness: 2,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#27A2DF',
    primaryContainer: '#01579B',
    secondaryContainer: 'rgba(1, 87, 155, 0.5)',
    onPrimaryContainer: '#FFFFFF',
    error: '#DD2C00',
    errorContainer: MD3DarkTheme.colors.errorContainer,
    patientAppointment: {
      background: '#FFFFFF',
      backgroundArchive: '#F5F5F5'
    },
    appointment: {
      lasts: '#daebd3'
    },
  },
}

const dark = {
  ...MD3DarkTheme,
  roundness: 2,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#27A2DF',
    primaryContainer: '#93E1EE',
    patientAppointment: {
      background: MD3DarkTheme.colors.inverseOnSurface,
      backgroundArchive: '#F5F5F5'
    }
  },
}

export type AppTheme = typeof light
export type AppThemeColors = keyof typeof light.colors

export const useAppTheme = () => useTheme<AppTheme>()

export default { 
  light, 
  dark,
  defaultDark: MD3DarkTheme,
  defaultLight: MD3LightTheme,
}
