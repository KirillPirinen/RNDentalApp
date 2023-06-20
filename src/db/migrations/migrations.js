import { addColumns, schemaMigrations, unsafeExecuteSql } from '@nozbe/watermelondb/Schema/migrations'
import { insertSettings } from '../raw-queries.js'
import { DEFAULT_SETTINGS } from '../../consts/index.js'
import { addSetting } from '../utils/addSetting.js'

export default schemaMigrations({
  migrations: [
    {
      toVersion: 2,
      steps: [
        addColumns({
          table: 'patients',
          columns: [
            { name: 'avatar', type: 'string', isOptional: true },
          ],
        }),
        addSetting('sync')
      ],
    },
  ]
})


