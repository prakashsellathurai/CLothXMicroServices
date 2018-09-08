'use strict'
var admin = require('firebase-admin')
var serviceAccount = require('./clothxnet-firebase-adminsdk-wkk1h-a27faaab6d.json')
var CONSTANTS = require('./CONSTANTS')
function CredentialsForProduction () {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: CONSTANTS.STORAGE_BUCKET
    })
    const firestore = admin.firestore()
    firestore.settings(CONSTANTS.FIRESTORE_SETTINGS)
    return admin
  } catch (e) {
    console.error(e)
  }
}
module.exports = {
  CredentialsForProduction: CredentialsForProduction
}
