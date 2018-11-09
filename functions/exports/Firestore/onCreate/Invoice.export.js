//= ===================================== IMPORTS ===============================================//
var functions = require('firebase-functions')
var db = require('../../../shared/firestore/CRUD/db')
function parseCustomerData (createdData, storeId) {
  return {
    'storeId': storeId,
    'customerNo': createdData.customerNumber,
    'customerName': createdData.customerName,
    'createdOn': createdData.createdOn,
    'totalPrice': createdData.totalPrice,
    'totalQuantity': createdData.totalQuantity
  }
}
// ===============================================================================================
function MainHandler (snap, context) {
  const storeId = context.params.storeId
  const invoiceId = context.params.invoiceId
  const createdData = snap.data()
  return db
    .deletePendingBill(storeId, invoiceId)
    .then(() => db.reward.updateCustomer(parseCustomerData(createdData, storeId)))
    .then(() => db.SetInvoicePendingStatusToFalse(invoiceId))
    .catch((err) => (err) ? db.SetInvoicePendingStatusToFalse(invoiceId) : console.error(err))
    .catch((err) => console.log(err))
}

// ==================================================================================================
// =====================================export module================================================
module.exports = functions
  .firestore
  .document('invoices/{invoiceId}')
  .onCreate((snap, context) => MainHandler(snap, context))
