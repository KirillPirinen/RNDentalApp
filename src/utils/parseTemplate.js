import { TAG_REGEX } from "../consts"
import formatRu from "./formatRu"

const reg = new RegExp(TAG_REGEX.source, TAG_REGEX.flags + "g")
const now = new Date()

const defaultSource = { 
  date: formatRu(now, 'd MMMM (cccc)'),
  time: formatRu(now, 'H:mm'),
  name: 'Иванов Иван Иванович'
}

class TagResolver {

  constructor(patient) {
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

}

export const parseTemplate = (text, source = defaultSource) => text.replace(reg, (substr, tag) => {
  const type = typeof source[tag]

  switch(type) {
    case 'function': return source[tag]() || ''
    case 'string': return source[tag]
  }

})

export const parseTemplateByPatient = async (template, patient) => {
  
  const tagResolver = new TagResolver(patient)

  await tagResolver.init()


  if(Array.isArray(template)) {
    return template.map(({ text, name, id }) => {
      return { text: parseTemplate(text, tagResolver), name, id }
    })
  }

  return parseTemplate(template, tagResolver)
}
