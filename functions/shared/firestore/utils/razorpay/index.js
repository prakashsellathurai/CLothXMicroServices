<<<<<<< master
const _save = require('./save')
const _get = require('./get')
module.exports = {
  save: _save,
  get: _get
=======
module.exports = {
  get: require('./get'),
  save: require('./save')
>>>>>>> added export files
}
