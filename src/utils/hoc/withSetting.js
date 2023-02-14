
import withObservables from '@nozbe/with-observables'
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider'

export const withSetting = (name) => (Component) => withDatabase(
  withObservables([], ({ database }) => ({
    setting: database.get('settings').findAndObserve(name)
  }))(Component)
)
