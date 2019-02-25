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
function productsPostedByStore (storeId) {
  return firestore.collection('products')
    .where('storeId', '==', `${storeId}`)
    .get()
    .then(qSnap => qSnap.forEach(doc => doc.ref.delete()))
}
module.exports = {
  invoice: invoice,
  pendingBill: pendingBill,
  productsPostedByStore: productsPostedByStore
}
