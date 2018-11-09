const db = require('./db')
const firestore = db.firestore

function pendingBill (storeId, PendingBillId) {
  return firestore
    .doc(`stores/${storeId}/pendingbills/${PendingBillId}`)
    .delete()
}
function invoice (invoiceId) {
  return firestore
    .doc(`invoices/${invoiceId}`)
    .delete()
    .catch(err => console.error(err))
}
module.exports = {
  pendingBill: pendingBill,
  invoice: invoice
}
