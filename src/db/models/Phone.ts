import { Model } from '@nozbe/watermelondb'
import { text, field, writer } from '@nozbe/watermelondb/decorators'
import { defaultUpdater } from '../../utils/defaultFn'

export default class Phone extends Model {
  static table = 'phones'

  static associations = {
    patients: { type: 'belongs_to', key: 'patient_id' },
  } as const
  
  @text('patient_id') patientId: string
  @field('is_primary') isPrimary: boolean
  @text('number') number: string

  @writer async markAsPrime(numbersToOff: Array<Phone>) {

    const batchPhones = numbersToOff?.map(phone => {
      return phone.prepareUpdate(instance => {
        instance.isPrimary = false
      })
    })

    await await this.batch(
      this.prepareUpdate(instance => {
        instance.isPrimary = true
      }),
      ...batchPhones
    )
  }

  @writer async updateInstance(fields: Record<string, this[keyof this]>) {
    await this.update(defaultUpdater(fields))
  }

}
