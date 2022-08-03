import { Platform } from 'react-native'
import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'

import schema from './models/schema'
import migrations from './migrations/migrations'
import Patient from './models/Patient'

const adapter = new SQLiteAdapter({
  schema,
  migrations,
  dbName: 'dental',
  jsi: false, //Platform.OS === 'ios'
  onSetUpError: error => {
    // Database failed to load -- offer the user to reload the app or log out
  }
})

export const database = new Database({
  adapter,
  modelClasses: [
    Patient
  ],
})
