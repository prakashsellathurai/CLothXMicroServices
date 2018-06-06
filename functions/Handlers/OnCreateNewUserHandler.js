'use strict'
const functions = require('firebase-functions')

// custom Function imports
const onCreateUser = require('.././auth/OncreateNewUser')
module.exports = function () {
  return functions.firestore
    .document('/newUser/{userId}').onCreate(
      (snap, context) => {
        const newUser = snap.data()
        const name = newUser.name
        const password = newUser.password
        const phoneNumber = newUser.phoneNumber
        return onCreateUser.sendMessage(name, password, phoneNumber)
      }
    )
}
