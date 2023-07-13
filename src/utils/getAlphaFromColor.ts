import tinycolor2 from 'tinycolor2'

export const getAlphaFromColor = (hex: string, number = 0.3) => {
  return `#${tinycolor2(hex).setAlpha(number).toRgbString()}`
}
