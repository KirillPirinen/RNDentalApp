import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

const light = {
  ...MD3LightTheme,
  roundness: 2,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#27A2DF',
    primaryContainer: '#01579B',
    onPrimaryContainer: '#FFFFFF',
    error: '#DD2C00',
    errorContainer: MD3DarkTheme.colors.errorContainer,
    patientAppointment: {
      background: '#FFFFFF'
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
      background: MD3DarkTheme.colors.inverseOnSurface
    }
  },
}


export default { 
  light, 
  dark,
  defaultDark: MD3DarkTheme,
  defaultLight: MD3LightTheme,
}
