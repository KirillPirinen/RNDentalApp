/* eslint-disable */
const { spawn } = require('child_process')
const fs = require('fs'); 
const path = require('path');

const sourceLocale = 'ru'

const localesPath = path.resolve(process.env.PWD, 'src/locales')

const args = process.argv.slice(2)

const lingui = spawn('lingui', ['extract', ...args])

lingui.stdout.on('data', (data) => {
  process.stdout.write(data)
  const locales = fs.readdirSync(localesPath)
  const targetLocales = locales.filter(locale => locale !== sourceLocale)

  if (!locales.includes(sourceLocale) || !targetLocales.length) return;

  const getMessages = (locale) => require(path.resolve(localesPath, locale, 'messages.json'))

  const sourceMessages = getMessages(sourceLocale)
  const subSource = getMessages('en')

  targetLocales.forEach((locale) => {
    const messages = getMessages(locale)
    const noKeys = {}
    const collistion = []

    Object.keys(sourceMessages).forEach((key) => {
      if (!messages[key]) {
        noKeys[key] = subSource[key] || sourceMessages[key]
        delete messages[key]
      }
    })

    Object.keys(messages).forEach((key) => {
      if (!sourceMessages[key]) {
        delete messages[key]
        collistion.push(key)
      }
    })

    Object.keys(noKeys).length && console.log(`Нужно добавить перевод для локали ${locale}, ключи: \n`, noKeys)
    collistion.length && console.log(`Удалили из локали ${locale}, ключи: \n`, collistion)

    fs.writeFileSync(
      path.resolve(localesPath, locale, 'messages.json'),
      JSON.stringify(messages, null, 2).replace(/([{[,]\s*)(\w+)(\s*:)/g, '$1\n  $2$3'),
    );
  })
})

lingui.stderr.on('data', (data) => {
  process.stderr.write(data)
})
