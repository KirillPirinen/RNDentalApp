import formatRu from "./formatRu"

class TagResolver {

  constructor(patient) {
    this.patient = patient
    this.hash = {}
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

  name () {
    return this.patient.fullName
  }

}

export const parseTemplateByPatient = async (template, patient) => {
  
  const tagResolver = new TagResolver(patient)

  await tagResolver.init()

  const parse = (text) => text.replace(/\[\-(.*?)\-]/g, (substr, tag) => tagResolver[tag]?.() || '')

  if(Array.isArray(template)) {
    return template.map(({ text, name, id }) => {
      return { text: parse(text), name, id }
    })
  }

  return parse(template)
}
