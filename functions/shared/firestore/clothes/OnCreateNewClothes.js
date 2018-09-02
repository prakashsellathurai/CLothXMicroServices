var admin = require('firebase-admin')
var functions = require('firebase-functions')

var crnAdder = require('../../utils/crn/oncreate')

var firestore = admin.firestore()

var OncreateNewClothes = functions.firestore
  .document('stores/{storeId}/clothes/{clothId}')
  .onCreate((snap, context) => {
    // local variables
    const storeId = context.params.storeId
    const clothId = context.params.clothId

    // db refrerences
    var StoreRef = firestore.collection('stores').doc(storeId)
    var clothRef = firestore.collection(`stores/${storeId}/clothes/`).doc(`${clothId}`)
    var crnContentref = firestore.collection(`stores/${storeId}/crnContent/`)

    return crnAdder.OncreateHandler(StoreRef, clothRef, crnContentref)
  })

module.exports = OncreateNewClothes
