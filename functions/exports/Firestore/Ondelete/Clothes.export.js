var admin = require('firebase-admin')
var functions = require('firebase-functions')
var firestore = admin.firestore()

var crnAdder = require('../../../shared/utils/crn/ondelete')
var OndeleteClothes = functions.firestore
  .document('stores/{storeId}/clothes/{clothId}').onDelete((snap, context) => {
    const deletedcloth = snap.data()
    // local variables
    const storeId = context.params.storeId
    const clothId = context.params.clothId
    const crn = deletedcloth.crn

    // db refrerences
    var StoreRef = firestore.collection('stores').doc(storeId)
    var clothRef = firestore.collection(`stores/${storeId}/clothes/`).doc(`${clothId}`)
    var crnContentref = firestore.collection(`stores/${storeId}/crnContent/`)

    return crnAdder.ondeleteHandler(StoreRef, clothRef, crnContentref, crn, storeId, clothId)
  })
module.exports = OndeleteClothes
