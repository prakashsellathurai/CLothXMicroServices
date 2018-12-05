let admin = require('firebase-admin')
let firestore = admin.firestore()
let update = require('./update')
function invoicePendingStatusToFalse (invoiceId) {
  return update.invoicePendingStatus(invoiceId, 'false')
}

function productPRN (productId, PRN_VALUE) {
  return firestore
    .doc(`/products/${productId}`)
    .set({
      prn: PRN_VALUE,
      createdOn: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true })
}
function objectIDtoProduct (productId, variants) {
  return firestore
    .doc(`/products/${productId}`)
    .set({
      variants: variants
    }, {
      merge: true
    })
}
module.exports = {
  invoicePendingStatusToFalse: invoicePendingStatusToFalse,
  productPRN: productPRN,
  objectIDtoProduct: objectIDtoProduct
}
