'use strict'
var admin = require('firebase-admin')
var serviceAccount = require('./clothxnet-firebase-adminsdk-wkk1h-a27faaab6d.json')
var env = require('./env')
function CredentialsForProduction () {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: env.STORAGE_BUCKET
    })
    const firestore = admin.firestore()
    firestore.settings(env.FIRESTORE_SETTINGS)
    return admin
  } catch (e) {
    console.error(e)
  }
}
module.exports = {
  CredentialsForProduction: CredentialsForProduction
}
