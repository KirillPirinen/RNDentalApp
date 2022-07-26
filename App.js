import { Provider } from 'react-redux'
import { store } from './src/redux/store'
import ThemeAdapter from './src/components/ThemeAdapter'
import Router from './src/router'

const App = () => {
  return (
    <Provider store={store}>
      <ThemeAdapter>
        <Router />
      </ThemeAdapter>
    </Provider>
  )
}

export default App
