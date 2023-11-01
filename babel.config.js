module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ["macros"],
      ['@babel/plugin-proposal-decorators', {legacy: true}],
      ['@babel/plugin-transform-flow-strip-types'],
      ['@babel/plugin-proposal-class-properties', {loose: true}],
      ['react-native-paper/babel'],
    ]
  }
}
