'use strict'
var admin = require('firebase-admin')
var path = require('path')
let env = require('./env')
/**
 * initializes firebase admin sdk
 * @returns {Object}firebaseAdmin => admin with credentials
 */
function setCredentials () {
  try {
    var fs = require('fs')
    let deploymentProjectConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '/.deployenv'), 'utf8'))
    let serviceAccount = (deploymentProjectConfig.production)
      ? env.FIREBASE_PROJECT.prod.serviceAccount
      : env.FIREBASE_PROJECT.test.serviceAccount
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
module.exports = {
  setCredentials: setCredentials
}
