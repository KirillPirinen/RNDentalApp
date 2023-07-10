import { Model, Query } from '@nozbe/watermelondb'
import { immutableRelation, text } from '@nozbe/watermelondb/decorators'
import Group from './Group';
import Patient from './Patient';

export default class PatientsGroups extends Model {
  static table = 'patients_groups'

  static associations = {
    patients: { type: 'belongs_to', key: 'patient_id' },
    groups: { type: 'belongs_to', key: 'group_id' },
  } as const

  @text('patient_id') patientId: string;
  @text('group_id') groupId: string

  @immutableRelation('groups', 'group_id') group: Query<Group>
  @immutableRelation('patients', 'patient_id') patient: Query<Patient>

}
