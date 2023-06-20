import ThemeAdapter from './src/components/ThemeAdapter'
import Router from './src/router'
import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider'
import database from './src/db'
import { LogBox } from 'react-native'
import { GeneralContextProvider } from './src/context/general-context'
import { ContextedPortal } from './src/components/__components__/__Portal'

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state.',
]);

const App = () => {
  return (
      <DatabaseProvider database={database}>
        <GeneralContextProvider>
          <ThemeAdapter>
              <Router />
              <ContextedPortal />
          </ThemeAdapter>
        </GeneralContextProvider>
      </DatabaseProvider>
  )
}

export default App
