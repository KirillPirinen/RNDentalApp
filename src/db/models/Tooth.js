import { Model } from '@nozbe/watermelondb'
import { text, writer, lazy, children, field } from '@nozbe/watermelondb/decorators'
import { defaultUpdater } from '../../utils/defaultFn'
import { Q } from '@nozbe/watermelondb'

export default class Tooth extends Model {
  static table = 'teeth'

  static associations = {
    formulas: { type: 'belongs_to', key: 'formula_id' },
    appointments_teeth: { type: 'has_many', foreignKey: 'tooth_id' },
  }
  
  @text('formula_id') formulaId
  @text('tooth_no') toothNo
  @text('tooth_state') toothState
  @text('notes') notes
  @field('is_treated') isTreated
  @children('appointments_teeth') associatedRecords

  @lazy allAppointments = this.collections.get('appointments')
    .query(Q.on('appointments_teeth', 'tooth_id', this.id))

  @writer async updateInstance(fields) {
    await this.update(defaultUpdater(fields))
  }

  @writer async deleteInstance() {
    //await this.appointments.destroyAllPermanently()
    return await this.markAsDeleted()
  }

}
