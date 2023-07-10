import { Model, Query } from '@nozbe/watermelondb'
import { text, writer, lazy, children } from '@nozbe/watermelondb/decorators'
import { defaultUpdater } from '../../utils/defaultFn'
import { Q } from '@nozbe/watermelondb'
import PatientsGroup from './PatientsGroups'
import Patient from './Patient'

export default class Group extends Model {
  static table = 'groups'

  static associations = {
    patients_groups: { type: 'has_many', foreignKey: 'group_id' },
  } as const
  
  @text('name') name: string
  @text('description') description: string | null
  @children('patients_groups') associatedRecords: Query<PatientsGroup>

  @lazy allPatients = this.collections.get<Patient>('patients')
    .query(Q.on('patients_groups', 'group_id', this.id))

  @writer async updateInstance(fields: object, batches?: Model[]) {
    if (batches) {
      return await this.batch(this.prepareUpdate(defaultUpdater(fields)), ...batches)
    }
    await this.update(defaultUpdater(fields))
  }

  @writer async deleteInstance() {
    //await this.appointments.destroyAllPermanently()
    return await this.markAsDeleted()
  }

  @writer async addPatient(patient: Patient) {
    return await this.collections.get<PatientsGroup>('patients_groups').create((instance) => {
      instance.patientId = patient.id
      instance.groupId = this.id
    })
  }

  async prepareRemovePatient(patient: Patient, instant?: boolean) {
    const api = instant ? 'destroyPermanently' : 'prepareDestroyPermanently'
    const entities = await this.collections.get<PatientsGroup>('patients_groups').query(
      Q.and(
        Q.where('patient_id', patient.id),
        Q.where('group_id', this.id)
      )
    )

    if (entities[0]) {
      return await entities[0][api]()
    }

  }

  @writer async removePatient(patient: Patient) {
    await this.prepareRemovePatient(patient, true)
  }
}
