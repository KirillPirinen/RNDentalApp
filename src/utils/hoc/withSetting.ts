
import withObservables from '@nozbe/with-observables'
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider'
import { Database, Q } from '@nozbe/watermelondb'
import { switchMap, of } from 'rxjs'
import { AllowedSettings, DEFAULT_SETTINGS } from '../../consts'
import Settings, { NamedSetting } from '../../db/models/Settings'

export const extractSetting = (db: Database, name: keyof AllowedSettings, ...operators: Array<any>) => db
  .get('settings')
    .query(Q.where('name', name))
      .observe()
        .pipe(
          switchMap(([setting]: Array<Settings>) => setting ? setting.observe() : of({
            name, 
            value: DEFAULT_SETTINGS[name]
          })),
           
          //@ts-ignore
          ...operators
        )

export const withSetting = <N extends keyof AllowedSettings>(name: N) => <P extends { setting: NamedSetting<N> }>(Component: React.ComponentType<P>) => {
  
  const NewComp: React.ComponentType<Omit<P, 'setting'>> = withDatabase(
    withObservables([], ({ database }: { database: Database }) => ({
      setting: extractSetting(database, name)
      // @ts-ignore
    }))(Component)
  )

  return NewComp
}
