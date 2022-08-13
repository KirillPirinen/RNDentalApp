import ThemeAdapter from './src/components/ThemeAdapter'
import Router from './src/router'
import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider'
import { database } from './src/db'
import { LogBox } from 'react-native'

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const App = () => {
  return (
    <ThemeAdapter>
      <DatabaseProvider database={database}>
          <Router />
      </DatabaseProvider>
    </ThemeAdapter>
  )
}

export default App
