'use strict'
var admin = require('firebase-admin')
var serviceAccount = require('./clothxnet-firebase-adminsdk-wkk1h-a27faaab6d.json')
var CONSTANTS = require('./CONSTANTS')
function CredentialsForProduction () {
  try {
    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: CONSTANTS.STORAGE_BUCKET
    })
  } catch (e) {
    console.error(e)
  }
}
module.exports = {
  CredentialsForProduction: CredentialsForProduction
}
