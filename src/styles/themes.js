import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

const light = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2A86FF',
  },
}

const dark = {
  primary: 'black',
}

export default { 
  light, 
  dark 
}
