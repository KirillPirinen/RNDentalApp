import { Model } from '@nozbe/watermelondb'
import { text, field, relation, date } from '@nozbe/watermelondb/decorators'

export default class Appointment extends Model {
  static table = 'appointments'

  @text('patient_id') patientId
  @date('date') date
  @field('is_confirmed') isConfirmed
  @field('is_skipped') isSkipped
  @field('is_postponed') isPostponed
  @field('price') price
  @text('diagnosis') diagnosis
  @text('notes') notes
  @text('teeth') teeth

  @relation('patients', 'id') patient

}


