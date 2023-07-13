import { TAG_REGEX } from '../consts'
import Patient from '../db/models/Patient'
import Template from '../db/models/Template'
import formatRu from './formatRu'

const reg = new RegExp(TAG_REGEX.source, TAG_REGEX.flags + 'g')
const now = new Date()

type Source = Record<string, string | (() => string)>

const defaultSource: Source = {
  date: formatRu(now, 'd MMMM (cccc)'),
  time: formatRu(now, 'H:mm'),
  name: 'Иванов Иван Иванович'
}

class TagResolver {
  patient: Patient;
  hash: Record<string, Date | null>;
  name: string;

  constructor (patient: Patient) {
    this.patient = patient
    this.hash = {}
    this.name = this.patient.fullName
  }

  async init () {
    try {
      const nextAppointment = await this.patient.nextAppointment.fetch()
      this.hash.metaDate = nextAppointment[0]?.date
    } catch {
      this.hash.metaDate = null
    }
  }

  date () {
    return this.hash.metaDate ? formatRu(this.hash.metaDate, 'd MMMM (cccc)') : '[приемов не найдено]'
  }

  time () {
    return this.hash.metaDate ? formatRu(this.hash.metaDate, 'H:mm') : '[приемов не найдено]'
  }

  getSource() {
    return {
      date: this.date,
      time: this.time,
      name: this.name
    }
  }
}

export const parseTemplate = (text: string, source: Source = defaultSource) => text.replace(reg, (substr: string, tag: string) => {
  switch (typeof source[tag]) {
    case 'function': return (source[tag] as () => string)() || ''
    case 'string': return source[tag] as string
    default: return ''
  }
})

export const parseTemplateByPatient = async (template: Template[] | string, patient: Patient) => {
  const tagResolver = new TagResolver(patient)

  await tagResolver.init()

  if (Array.isArray(template)) {
    return template.map(({ text, name, id }) => {
      return { text: parseTemplate(text, tagResolver.getSource()), name, id }
    })
  }

  return parseTemplate(template, tagResolver.getSource())
}
