import '@formatjs/intl-locale/polyfill'
import '@formatjs/intl-pluralrules/polyfill'
import '@formatjs/intl-pluralrules/locale-data/en'
import '@formatjs/intl-pluralrules/locale-data/ru'
import '@formatjs/intl-pluralrules/locale-data/zh'
import '@formatjs/intl-pluralrules/locale-data/es'
import '@formatjs/intl-pluralrules/locale-data/de'
import '@formatjs/intl-pluralrules/locale-data/fr'
import '@formatjs/intl-pluralrules/locale-data/hi'

import ThemeAdapter from './src/components/ThemeAdapter'
import Router from './src/router'

import { dbAsync } from './src/db'
import { LogBox } from 'react-native'
import { GeneralContextProvider } from './src/context/general-context'
import { ContextedPortal } from './src/widgets/Portal'
import { useLayoutEffect, useState } from 'react'
import { Database } from '@nozbe/watermelondb'
import { appConfigAsync, appConfigSync, appMessages } from './src/consts/config'
import { i18n } from "@lingui/core"
import { DatabaseProvider } from '@nozbe/watermelondb/DatabaseProvider'
import { I18nProvider } from '@lingui/react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state.',
]);

const App = () => {
  const [database, setDatabase] = useState<Database | null>(null)

  useLayoutEffect(() => {
    appConfigAsync.finally(() => {
      i18n.loadAndActivate({ locale: appConfigSync.lang, messages: appMessages[appConfigSync.lang] })
    })
    dbAsync.then(setDatabase)
  }, [])

  return database && (
      <DatabaseProvider database={database}>
        <I18nProvider i18n={i18n}>
          <GestureHandlerRootView>
            <GeneralContextProvider>
              <ThemeAdapter>
                <Router />
                <ContextedPortal />
              </ThemeAdapter>
            </GeneralContextProvider>
          </GestureHandlerRootView>
          </I18nProvider>
      </DatabaseProvider>
  )
}

export default App
