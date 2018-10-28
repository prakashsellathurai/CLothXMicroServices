//= ===================================== IMPORTS ===============================================//
var functions = require('firebase-functions')
// ==================================================================================================
// =====================================export module================================================
module.exports = functions
  .firestore
  .document('stores/{storeId}/pendingbills/{pendingBillId}')
  .onWrite((change, context) => {
    const document = change.after.exists ? change.after.data() : null
    const oldDocument = change.before.data()
    const storeId = context.params.storeId
    const pendingBillId = context.params.pendingBillId
    if (document === null) {
      return Promise.resolve(0)
    } else {
      const cartProducts = document.cartProducts
      return Promise.resolve(0)
    }
  })
