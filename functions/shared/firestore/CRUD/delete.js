let admin = require('firebase-admin')
let firestore = admin.firestore()
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
function store (storeId) {
  return firestore
    .doc(`stores/${storeId}`)
    .delete()
}
function product (productId) {
  return firestore
    .doc(`products/${productId}`)
    .delete()
}
function user (userId) {
  return firestore
    .doc(`users/${userId}`)
    .delete()
}
module.exports = {
  user: user,
  store: store,
  product: product,
  invoice: invoice,
  pendingBill: pendingBill
}
