// uncomment this while production
var env = require('../../environment/env')
var admin = require('../../environment/initAdmin').setCredentials()
const firestore = admin.firestore()
firestore.settings(env.FIRESTORE_SETTINGS)
// const settings = {timestampsInSnapshots: true}
// this function relates to oncreateStore trigger won't work on other
const _update = require('./update')
const _reduce = require('./reduce')
const _return = require('./return')
const _associate = require('./associate')
const _delete = require('./delete')
const _get = require('./get')
const _set = require('./set')
const _assign = require('./assign')

const utils = require('./../utils/index')
const _timestamp = require('./timestamp')
module.exports = {
  admin: admin,
  firestore: firestore,
  update: _update,
  reduce: _reduce,
  return: _return,
  associate: _associate,
  delete: _delete,
  assign: _assign,
  get: _get,
  set: _set,
  timestamp: _timestamp,
  utils: utils
}
