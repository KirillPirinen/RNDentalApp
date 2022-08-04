import { schemaMigrations, createTable, unsafeExecuteSql, addColumns } from '@nozbe/watermelondb/Schema/migrations'

export default schemaMigrations({
  migrations: [
    {
      toVersion: 2,
      steps: [
        unsafeExecuteSql(
          'drop table patients;'
        ),
        createTable({
          name: 'patients',
          columns: [
            { name: 'first_name', type: 'string' },
            { name: 'last_name', type: 'string' }
          ]
        }),
      ],
    },
    {
      toVersion: 3,
      steps: [
        unsafeExecuteSql(
          'drop table patients;'
        ),
        createTable({
          name: 'patients',
          columns: [
            { name: 'first_name', type: 'string' },
            { name: 'last_name', type: 'string' }
          ]
        }),
      ],
    },
    {
      toVersion: 4,
      steps: [
        addColumns({
          table: 'patients',
          columns: [
            { name: 'phone', type: 'string' }
          ]
        })
      ]
    }
  ],
})
