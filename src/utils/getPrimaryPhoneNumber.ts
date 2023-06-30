import Phone from "../db/models/Phone"

export const getPrimaryPhoneNumber = (phones: Phone[]) => {
  const primary = phones.find((phone) => phone.isPrimary)?.number
  return primary || phones[0]?.number
}
