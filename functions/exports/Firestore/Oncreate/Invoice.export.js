//= ===================================== IMPORTS ===============================================//
var functions = require('firebase-functions')
var dbFun = require('../../../shared/firestore/CRUD/db')
// ===============================================================================================
function MainHandler (snap, context) {
  const storeId = context.params.storeId
  const cartProducts = snap.data().cartProducts
  const invoiceId = context.params.invoiceId
  return dbFun.LocalInventoryUpdater(storeId, cartProducts)
    .then(() => dbFun.SetInvoicePendingStatusToFalse(storeId, invoiceId))
}
// ==================================================================================================
// =====================================export module================================================
module.exports = functions
  .firestore
  .document('stores/{storeId}/invoices/{invoiceId}')
  .onCreate((snap, context) => MainHandler(snap, context))
