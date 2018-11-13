const db = require('./index')
const firestore = db.firestore
function invoice (invoiceId) {
  return firestore
    .doc(`invoices/${invoiceId}`)
    .delete()
    .catch((err) => console.error(err))
}

function pendingBill (storeId, PendingBillId) {
  return firestore
    .doc(`stores/${storeId}/pendingbills/${PendingBillId}`)
    .delete()
}
module.exports = {
  invoice: invoice,
  pendingBill: pendingBill
}
