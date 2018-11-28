'use strict'
let initAdmin = require('./shared/environment/initAdmin')
initAdmin.setCredentials()

let init = require('./exports/export.js')
let exportFunctions = init.functions_aggregrator()

for (var name in exportFunctions) {
  module.exports[name] = require(exportFunctions[name])
}
