import { Model } from '@nozbe/watermelondb'
import { text, field, relation, date, writer } from '@nozbe/watermelondb/decorators'

export default class Appointment extends Model {
  static table = 'appointments'

  static associations = {
    patients: { type: 'belongs_to', key: 'patient_id' },
  }

  @text('patient_id') patientId
  @date('date') date
  @field('is_confirmed') isConfirmed
  @field('is_skipped') isSkipped
  @field('is_postponed') isPostponed
  @field('price') price
  @field('duration') duration
  @text('diagnosis') diagnosis
  @text('notes') notes
  @text('teeth') teeth

  @relation('patients', 'patient_id') patient

  @writer async deleteInstance() {
    return await this.markAsDeleted()
  }

}


