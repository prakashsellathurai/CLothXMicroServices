'use strict'
var admin = require('firebase-admin')
var ProductionEnvServiceAccount = require('./clothxnet-firebase-adminsdk-wkk1h-a27faaab6d.json')
var TestEnvServiceAccount = require('./clothxtest-firebase-adminsdk-0bpps-e18156c08d.json')
var path = require('path')
function setCredentials () {
  try {
    var fs = require('fs')
    let deploymentProjectConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '/.deployenv'), 'utf8'))
    let serviceAccount = (deploymentProjectConfig.production) ? ProductionEnvServiceAccount : TestEnvServiceAccount
    let storageBucket = deploymentProjectConfig.storage.bucket
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: storageBucket
    })

    return admin
  } catch (e) {
    console.error(e)
  }
}
module.exports = {
  setCredentials: setCredentials
}
