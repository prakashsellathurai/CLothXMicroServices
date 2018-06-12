var admin = require('firebase-admin')
var functions = require('firebase-functions')

var crnAdder = require('../../utils/crn/oncreate')
admin.initializeApp(functions.config())
var firestore = admin.firestore()

var OncreateNewClothes = functions.firestore
  .document('user/{userId}/clothes/{clothId}')
  .onCreate((snap, context) => {
    // local variables
    const userId = context.params.userId
    const clothId = context.params.clothId

    // db refrerences
    var userRef = firestore.collection('user').doc(userId)
    var clothRef = firestore.collection(`user/${userId}/clothes/`).doc(`${clothId}`)
    var crnContentref = firestore.collection(`user/${userId}/crnContent/`)

    return crnAdder.OncreateHandler(userRef, clothRef, crnContentref)
  })

module.exports = OncreateNewClothes
