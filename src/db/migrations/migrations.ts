import { addColumns, createTable, schemaMigrations } from '@nozbe/watermelondb/Schema/migrations'
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
    {
      toVersion: 3,
      steps: [
        createTable({
          name: 'groups',
          columns: [
            { name: 'name', type: 'string' },
            { name: 'description', type: 'string', isOptional: true },
          ],
        }),
        createTable({
          name: 'patients_groups',
          columns: [
            { name: 'group_id', type: 'string', isIndexed: true },
            { name: 'patient_id', type: 'string', isIndexed: true }
          ]
        }),
      ],
    },
  ]
})


