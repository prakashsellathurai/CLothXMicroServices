'use strict'
module.exports = (app) => {
  const glob = require('glob')
  const path = require('path')
  const FIRESTORE_TRIGGER_PATH = path.resolve(__dirname, './exports/firestore')
  const HTTP_TRIGGER_PATH = path.resolve(__dirname, './exports/http')
  const RTDB_TRIGGER_PATH = path.resolve(__dirname, './exports/Rtdb')
  const AUTH_TRIGGER_PATH = path.resolve(__dirname, './exports/Auth')
  const ANALYTICS_TRIGGER_PATH = path.resolve(__dirname, './exports/Analytics')
  const CRASHLYTICS_TRIGGER_PATH = path.resolve(__dirname, './exports/Crashlytics')
  const PUB_SUB_TRIGGER_PATH = path.resolve(__dirname, './exports/PubSub')
  const STORAGE_TRIGGER_PATH = path.resolve(__dirname, './exports/Storage')
  const EXPORTS_FOLDER = [
    FIRESTORE_TRIGGER_PATH,
    HTTP_TRIGGER_PATH,
    RTDB_TRIGGER_PATH,
    AUTH_TRIGGER_PATH,
    ANALYTICS_TRIGGER_PATH,
    CRASHLYTICS_TRIGGER_PATH,
    PUB_SUB_TRIGGER_PATH,
    STORAGE_TRIGGER_PATH
  ]
  for (let index = 0; index < EXPORTS_FOLDER.length; index++) {
    const element = EXPORTS_FOLDER[index]
    glob.sync('{,!(node_modules)/**/}*.export.js', { cwd: element }).forEach(file => {
      const only = process.env.FUNCTION_NAME
      const name = functionNameGenerator(file)
      if (only === undefined || only === name) {
        console.log(name + '' + 'file: ' + path.resolve(element, file))
        exports[name] = require(path.resolve(element, file))
      }
    })
  }
  function functionNameGenerator (file) {
    const camel = require('camelcase')
    const split = file.split('/')
    const event = split.pop().split('.')[0]
    const snake = `${split.join('_')}${event}`
    return camel(snake)
  }
}
