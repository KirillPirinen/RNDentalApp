import { Model } from '@nozbe/watermelondb'
import { immutableRelation } from '@nozbe/watermelondb/decorators'

export default class AppointmentTooth extends Model {
  static table = 'appointments_teeth'

  static associations = {
    teeth: { type: 'belongs_to', key: 'tooth_id' },
    appointments: { type: 'belongs_to', key: 'appointment_id' },
  }
  
  @immutableRelation('teeth', 'tooth_id') tooth
  @immutableRelation('appointments', 'appointment_id') appointment

}
