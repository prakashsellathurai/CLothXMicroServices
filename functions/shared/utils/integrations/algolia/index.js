const initIndex = require('./initIndex')
const _save = require('./save')
const generate = require('./generate')
const _update = require('./update')
const _delete = require('./delete')
module.exports = {
  initIndex: initIndex,
  save: _save,
  generate: generate,
  update: _update,
  delete: _delete
}
