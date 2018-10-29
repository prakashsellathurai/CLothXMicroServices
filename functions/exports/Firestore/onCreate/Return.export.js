//= ===================================== IMPORTS ===============================================//
const functions = require('firebase-functions')
const db = require('./../../../shared/firestore/CRUD/db')
function StockUpdater (isAllReturn, storeId, invoiceId, cartProducts) {
  if (isAllReturn) {
    return db
      .deleteInvoice(storeId, invoiceId)
      .then(() => db
        .LocalInventoryProductReturner(storeId, cartProducts))
  } else {
    return db
      .updateInvoiceOnProductsReturn(storeId, invoiceId, cartProducts)
      .then(() => db
        .LocalInventoryProductReturner(storeId, cartProducts))
  }
}
// ==================================================================================================
// =====================================export module================================================

module.exports = functions
  .firestore
  .document('stores/{storeId}/returns/{returnId}')
  .onCreate((snap, context) => {
    let storeId = context.params.storeId
    let returnId = context.params.returnId
    let isAllReturn = snap.data().isAllReturn
    let cartProducts = snap.data().cartProducts
    let invoiceId = snap.data().invoiceId
    return StockUpdater(isAllReturn, storeId, invoiceId, cartProducts)
      .then(() => db.TimestampOnCreateReturn(storeId, returnId))
  })
