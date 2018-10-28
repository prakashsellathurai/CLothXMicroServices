//= ===================================== IMPORTS ===============================================//
var functions = require('firebase-functions')
var dbFun = require('../../../shared/firestore/CRUD/db')
// ===============================================================================================
function MainHandler (snap, context) {
  const storeId = context.params.storeId
  const invoiceId = context.params.invoiceId
  return dbFun.deletePendingBill(storeId, invoiceId)
    .then(() => dbFun.SetInvoicePendingStatusToFalse(storeId, invoiceId))
    .catch((err) => {
      if (err) {
        return dbFun.SetInvoicePendingStatusToFalse(storeId, invoiceId)
      } else {
        console.error(err)
      }
    })
}
// ==================================================================================================
// =====================================export module================================================
module.exports = functions
  .firestore
  .document('stores/{storeId}/invoices/{invoiceId}')
  .onCreate((snap, context) => MainHandler(snap, context))
