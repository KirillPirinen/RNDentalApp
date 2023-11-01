import { formatter } from "@lingui/format-json"

module.exports = {
  locales: ["en", "ru", "zh", "es", "de", "fr", "hi"],
  catalogs: [
    {
      path: "<rootDir>/src/locales/{locale}/messages",
      include: ["src"],
    },
  ],
  format: formatter({ style: 'minimal' }),
  sourceLocale: 'ru'
};
