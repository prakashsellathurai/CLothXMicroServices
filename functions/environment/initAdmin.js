'use strict'
var admin = require('firebase-admin')
var serviceAccount = require('./clothxnet-firebase-adminsdk-wkk1h-a27faaab6d.json')
var CONSTANTS = require('./CONSTANTS')
module.exports = (function () {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: CONSTANTS.STORAGE_BUCKET
    })
  } catch (e) {
    console.error(e)
  }
})()
