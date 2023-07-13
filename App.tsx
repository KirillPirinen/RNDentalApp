import ThemeAdapter from './src/components/ThemeAdapter'
import Router from './src/router'
import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider'
import { dbAsync } from './src/db'
import { LogBox } from 'react-native'
import { GeneralContextProvider } from './src/context/general-context'
import { ContextedPortal } from './src/widgets/Portal'
import { useLayoutEffect, useState } from 'react'
import { Database } from '@nozbe/watermelondb'

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state.',
]);

const App = () => {
  const [database, setDatabase] = useState<Database | null>(null)

  useLayoutEffect(() => {
    dbAsync.then(setDatabase)
  }, [])

  return database && (
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
