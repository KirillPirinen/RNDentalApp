import { addColumns, createTable, schemaMigrations, unsafeExecuteSql } from '@nozbe/watermelondb/Schema/migrations'
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
            { name: 'color', type: 'string', isOptional: true },
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
    {
      toVersion: 4,
      steps: [
        addColumns({
          table: 'appointments',
          columns: [
            { name: 'is_archive', type: 'boolean' },
          ],
        }),
      ],
    },
    {
      toVersion: 5,
      steps: [
        unsafeExecuteSql(`
          UPDATE appointments
          SET _status = 'updated',
              is_archive = 1
          WHERE _status = 'deleted';  
        `)
      ],
    },
  ]
})


