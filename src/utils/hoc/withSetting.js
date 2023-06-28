
import withObservables from '@nozbe/with-observables'
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider'
import { Q } from '@nozbe/watermelondb'
import { switchMap, of } from 'rxjs'
import { DEFAULT_SETTINGS } from '../../consts'

export const extractSetting = (db, name, ...operators) => db
  .get('settings')
    .query(Q.where('name', name))
      .observe()
        .pipe(
          switchMap(([setting]) => setting ? setting.observe() : of({
            name, 
            value: DEFAULT_SETTINGS[name]
          })),
          ...operators
        )

export const withSetting = (name) => (Component) => withDatabase(
  withObservables([], ({ database }) => ({
    setting: extractSetting(database, name)
  }))(Component)
)
