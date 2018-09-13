'use strict'
const glob = require('glob')
const path = require('path')
const utils = require('../shared/utils/general_utils')
const FIRESTORE_TRIGGER_PATH = path.resolve(__dirname, './Firestore')
const HTTP_TRIGGER_PATH = path.resolve(__dirname, './Http')
const RTDB_TRIGGER_PATH = path.resolve(__dirname, './Rtdb')
const AUTH_TRIGGER_PATH = path.resolve(__dirname, './Auth')
const ANALYTICS_TRIGGER_PATH = path.resolve(__dirname, './Analytics')
const CRASHLYTICS_TRIGGER_PATH = path.resolve(__dirname, './Crashlytics')
const PUB_SUB_TRIGGER_PATH = path.resolve(__dirname, './PubSub')
const STORAGE_TRIGGER_PATH = path.resolve(__dirname, './Storage')
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
    const name = utils.functionNameGenerator(FILE)
    if (only === undefined || only === name) {
      let filepath = path.resolve(ABSOLUTE_PATH, FILE)
      console.log(filepath, name)
      // module.exports[name] = require(filepath)
    }
  })
}
