import ThemeAdapter from './src/components/ThemeAdapter'
import Router from './src/router'
import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider'
import { database } from './src/db'
import { LogBox } from 'react-native'
import { ModalContextProvider } from './src/context/modal-context'
import { ContextedPortal } from './src/components/Portal'

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state.',
]);

const App = () => {
  return (
    <ThemeAdapter>
      <DatabaseProvider database={database}>
        <ModalContextProvider>
          <Router />
          <ContextedPortal />
        </ModalContextProvider>
      </DatabaseProvider>
    </ThemeAdapter>
  )
}

export default App
