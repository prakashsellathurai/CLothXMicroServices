var admin = require('firebase-admin')
var functions = require('firebase-functions')
var firestore = admin.firestore()

var crnAdder = require('../../utils/crn/ondelete')
var OndeleteClothes = functions.firestore
  .document('user/{userId}/clothes/{clothId}').onDelete((snap, context) => {
    const deletedcloth = snap.data()
    // local variables
    const userId = context.params.userId
    const clothId = context.params.clothId
    const crn = deletedcloth.crn

    // db refrerences
    var userRef = firestore.collection('user').doc(userId)
    var clothRef = firestore.collection(`user/${userId}/clothes/`).doc(`${clothId}`)
    var crnContentref = firestore.collection(`user/${userId}/crnContent/`)

    return crnAdder.ondeleteHandler(userRef, clothRef, crnContentref, crn, userId, clothId)
  })
module.exports = OndeleteClothes
