//= ===================================== IMPORTS ===============================================//
var functions = require('firebase-functions')
var dbFun = require('../../../shared/firestore/CRUD/db')
// ==================================================================================================
// =====================================export module================================================
module.exports = functions
  .firestore
  .document('stores/{storeId}/invoices/{invoiceId}')
  .onCreate((snap, context) => {
    const storeId = context.params.storeId
    const cartProducts = snap.data().cartProducts
    const invoiceId = context.params.invoiceId
    return LocalInventoryUpdater(storeId, cartProducts)
      .then(() => dbFun.SetInvoicePendingStatusToFalse(storeId, invoiceId))
  })
function LocalInventoryUpdater (storeId, cartProducts) {
  let promises = []
  for (let index = 0; index < cartProducts.length; index++) {
    const cartProduct = cartProducts[index]
    let prn = cartProduct.prn
    let quantityToReduce = cartProduct.totalQuantity
    promises.push(dbFun.ReduceProductQuantity(storeId, prn, quantityToReduce))
  }
  return Promise.all(promises)
}
