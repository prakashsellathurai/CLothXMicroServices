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
    const invoiceId = context.params.InvoiceId
    return LocalInventoryUpdater(storeId, cartProducts)
      .then(() => UpdatePendingStatus(storeId, invoiceId, 'false'))
  })
function LocalInventoryUpdater (storeId, cartProducts) {
  let promises = []
  for (let index = 0; index < cartProducts.length; index++) {
    const cartProduct = cartProducts[index]
    let prn = cartProduct.prn
    let quantity_to_reduce = cartProduct.totalQuantity
    promises.push(UpdateProductQuantity(storeId, prn, quantity_to_reduce))
  }
  return Promise.all(promises)
}
function UpdateProductQuantity (storeId, prn, quantity) {
  return dbFun.ReduceProductQuantity(storeId, prn, quantity)
}
function UpdatePendingStatus (storeId, invoiceId, UPDATE_STATUS_BOOLEAN) {
  return dbFun.UpdatInvoicePendingStatus(storeId, invoiceId, UPDATE_STATUS_BOOLEAN)
}
