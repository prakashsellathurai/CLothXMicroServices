'use strict'
const intAdmin = require('./shared/environment/initAdmin')
intAdmin.CredentialsForProduction()
const glob = require('glob')
const path = require('path')
const FIRESTORE_TRIGGER_PATH = path.resolve(__dirname, './exports/Firestore')
const HTTP_TRIGGER_PATH = path.resolve(__dirname, './exports/Http')
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
  const ABSOLUTE_PATH = EXPORTS_FOLDER[index]
  glob.sync('{,!(node_modules)/**/}*.export.js', { cwd: ABSOLUTE_PATH }).forEach(FILE => {
    const only = process.env.FUNCTION_NAME
    const name = functionNameGenerator(FILE)
    if (only === undefined || only === name) {
      let filepath = path.resolve(ABSOLUTE_PATH, FILE)
      console.log(filepath)
      module.exports[name] = require(filepath)
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
