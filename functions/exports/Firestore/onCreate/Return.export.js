//= ===================================== IMPORTS ===============================================//
const functions = require('firebase-functions')
const db = require('./../../../shared/firestore/CRUD/db')
// ==================================================================================================
// =====================================export module================================================

module.exports = functions
  .firestore
  .document('stores/{storeId}/return/{returnId}')
  .onCreate((snap, context) => {
    let storeId = context.params.storeId
    let isAllReturn = snap.data().isAllReturn
    let cartProducts = snap.data().cartProducts
    if (isAllReturn) {
      let invoiceId = snap.data().invoiceId
      return db.deleteInvoice(storeId, invoiceId)
        .then(() => db.LocalInventoryProductReturner(storeId, cartProducts))
    } else {
      return db.LocalInventoryProductReturner(storeId, cartProducts)
    }
  })
