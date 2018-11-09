//= ===================================== IMPORTS ===============================================//

const functions = require('firebase-functions')
const db = require('./../../../shared/firestore/CRUD/db')
function StockUpdater (isAllReturn, storeId, invoiceId, cartProducts) {
  if (isAllReturn) {
    return db
      .deleteInvoice(invoiceId)
      .then(() => db
        .LocalInventoryProductReturner(storeId, cartProducts))
  } else {
    return db
      .updateInvoiceOnProductsReturn(invoiceId, cartProducts)
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
    let customerNo = snap.data().customerNumber
    return StockUpdater(isAllReturn, storeId, invoiceId, cartProducts)
      .then(() => db.TimestampOnCreateReturn(storeId, returnId))
        .then(() => db.updateAndMergeReturnCountInReward(customerNo, cartProducts.length))

  })
