import { DefaultTheme } from 'react-native-paper'

const light = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2A86FF',
    accent: '#f1c40f',
  },
};

const dark = {
  primary: 'black',
}

export default { 
  light, 
  dark 
}
