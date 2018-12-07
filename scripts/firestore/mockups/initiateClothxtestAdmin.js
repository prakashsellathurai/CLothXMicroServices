'use strict'
let initAdmin = require('./../../../functions/shared/environment/initAdmin')
let Promise = require('bluebird')
var cmd = require('node-cmd')
function test_admin (params) {
  try {
    const get_async_cmd = Promise.promisify(cmd.get, {multiArgs: true, context: cmd})
    let data = get_async_cmd('node ./scripts/setDeploymentenv.js clothxtest')
    if (data) {
      let admin = initAdmin.setCredentials()
      return admin
    }
  } catch (e) {
    console.error(e)
    return e
  }
}
module.exports = {
  test_admin: test_admin
}
