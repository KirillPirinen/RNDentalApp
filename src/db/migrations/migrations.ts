import { addColumns, schemaMigrations } from '@nozbe/watermelondb/Schema/migrations'
import { addSetting } from '../utils/addSetting'

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
        addSetting('sync')!
      ],
    },
  ]
})


