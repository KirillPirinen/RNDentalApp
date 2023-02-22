import { Model } from '@nozbe/watermelondb'
import { text, writer, date, readonly } from '@nozbe/watermelondb/decorators'
import { defaultUpdater } from '../../utils/defaultFn'
import * as FileSystem from 'expo-file-system';

export default class File extends Model {
  static table = 'files'

  static associations = {
    patients: { type: 'belongs_to', key: 'patient_id' },
  }
  
  @text('patient_id') patientId
  @text('name') name
  @text('type') type
  @readonly @date('created_at') createdAt

  get uri() {
    return `${FileSystem.documentDirectory}${this.patientId}/${this.name}`
  }

  @writer async updateInstance(fields) {
    await this.update(defaultUpdater(fields))
  }

  @writer async deleteInstance() {
    try {
      await this.destroyPermanently()
      return await FileSystem.deleteAsync(this.uri)
    } catch (e) {
      console.log(e)
    }
  }

}
