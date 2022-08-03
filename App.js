import { Provider } from 'react-redux'
import { store } from './src/redux/store'
import ThemeAdapter from './src/components/ThemeAdapter'
import Router from './src/router'
import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider'
import { database } from './src/db'

const App = () => {
  return (
    <Provider store={store}>
      <ThemeAdapter>
        <DatabaseProvider database={database}>
          <Router />
        </DatabaseProvider>
      </ThemeAdapter>
    </Provider>
  )
}

export default App
