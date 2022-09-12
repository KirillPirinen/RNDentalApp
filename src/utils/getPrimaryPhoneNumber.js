export const getPrimaryPhoneNumber = (phones) => {
  const primary = phones.find((phone) => phone.isPrimary)?.number
  return primary || phones[0]?.number
}
