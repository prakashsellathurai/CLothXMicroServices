//= ===================================== IMPORTS ===============================================//

const functions = require('firebase-functions')
const db = require('./../../../shared/firestore/CRUD/index')
function StockUpdater (isAllReturn, invoiceId, cartProducts) {
  return invoiceUpdater(isAllReturn, invoiceId, cartProducts)
    .then(() => db
      .return
      .productsOnLocalInventory(cartProducts))
}
function invoiceUpdater (isAllReturn, invoiceId, cartProducts) {
  if (isAllReturn) {
    return db
      .delete
      .invoice(invoiceId)
  } else {
    return db
      .update
      .invoiceOnProductsReturn(invoiceId, cartProducts)
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
    return StockUpdater(isAllReturn, invoiceId, cartProducts)
      .then(() => db.timestamp.OnCreateReturn(storeId, returnId))
      .then(() => db.update.returnCountInReward(customerNo, cartProducts.length))
  })
