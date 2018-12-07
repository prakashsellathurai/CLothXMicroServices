'use strict'
var admin = require('firebase-admin')
var path = require('path')
let env = require('./env')
var ProductionEnvServiceAccount = env.FIRESTORE.PRODUCTION_CREDENTIALS
var TestEnvServiceAccount = env.FIRESTORE.TEST_CREDENTIALS
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
    let firestore = admin.firestore()
    firestore.settings(env.FIRESTORE.SETTINGS)
    return admin
  } catch (e) {
    console.error(e)
  }
}
module.exports = {
  setCredentials: setCredentials
}
