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
    let databaseURL = deploymentProjectConfig.databaseURL
    admin.initializeApp({
      databaseURL: databaseURL,
      credential: admin.credential.cert(serviceAccount),
      storageBucket: storageBucket
    })
    let firestore = admin.firestore()
    let db = admin.database()
    firestore.settings(env.FIRESTORE_SETTINGS)
    return admin
  } catch (e) {
    console.error(e)
  }
}
/**
 * intiates firebase database admin without previous cloud functions that are running on the firebase
 * @returns {object} firebase admin
 */
function withrawdb () {
  try {
    let localconfig = env.testing.local
    admin.initializeApp({
      databaseURL: localconfig.databaseUrl,
      credential: admin.credential.cert(localconfig.adminCert),
      storageBucket: localconfig.storagebucket
    })
    let firestore = admin.firestore()
    let db = admin.database()
    firestore.settings(env.FIRESTORE_SETTINGS)
    return admin
  } catch (error) {
    console.error(error)
  }
}
/**
 * @namespace
 * @borrows setCredentials as setCredentials
 * @borrows  withrawdb as withrawdb
 */
module.exports = {
  setCredentials: setCredentials,
  withrawdb: withrawdb
}
