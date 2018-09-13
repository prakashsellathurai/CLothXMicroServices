'use strict'

const intAdmin = require('./shared/environment/initAdmin')
intAdmin.CredentialsForProduction()

let exporthe = require('./exports/export.js')
exporthe.exportTheFUnctions()