//= ===================================== IMPORTS ===============================================//
var functions = require('firebase-functions')
const db = require('./../../../shared/firestore/CRUD/db')
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
    let invoiceId = document.invoiceId
    if (document === null) {
      return Promise.resolve(0)
    } else {
      const cartProducts = document.cartProducts
      return db.LocalInventoryProductReducer(storeId, cartProducts)
        .then(() => db.SetInvoicePendingStatusToFalse(storeId, invoiceId))
    }
  })
