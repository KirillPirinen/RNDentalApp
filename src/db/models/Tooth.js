import { Model } from '@nozbe/watermelondb'
import { text, field, writer } from '@nozbe/watermelondb/decorators'

export default class Tooth extends Model {
  static table = 'teeth'

  static associations = {
    formulas: { type: 'belongs_to', key: 'formula_id' },
  }
  
  @text('formula_id') formulaId
  @text('tooth_no') toothNo
  @field('tooth_state') toothState

  @writer async updateInstance(fields) {
    await this.update(instance => {
        Object.keys(fields).forEach((key) => {
          instance[key] = fields[key]
        })
    })
  }

  @writer async deleteInstance() {
    await this.appointments.destroyAllPermanently()
    return await this.markAsDeleted()
  }

}
