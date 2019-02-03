'use strict'
const _create = require('./create')
const _update = require('./update')
const _reduce = require('./reduce')
const _return = require('./return')
const _associate = require('./associate')
const _delete = require('./delete')
const _get = require('./get')
const _set = require('./set')
const _assign = require('./assign')
const _timestamp = require('./timestamp')
const _log = require('./log')
const utils = require('./../utils/index')
module.exports = {
  create: _create,
  update: _update,
  reduce: _reduce,
  return: _return,
  associate: _associate,
  delete: _delete,
  assign: _assign,
  get: _get,
  set: _set,
  timestamp: _timestamp,
  utils: utils,
  log: _log
}
