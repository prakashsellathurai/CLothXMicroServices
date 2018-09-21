'use strict'

const intAdmin = require('./shared/environment/initAdmin')
intAdmin.CredentialsForProduction()

let init = require('./exports/export.js')
let exportFunctions = init.functions_aggregrator()

for (var name in exportFunctions) {
  module.exports[name] = require(exportFunctions[name])
}
