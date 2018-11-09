const db = require('./db')
const firestore = db.firestore
const admin = db.admin

function randomPendingBillToken (storeId, pendingBillId) {
  let obj = {
    pendingBillToken: getRndInteger(1, 10000)
  }
  return firestore
    .doc(`store/${storeId}/pendingbills/${pendingBillId}`)
    .update(obj)
}
function getRndInteger (min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}
function productPRN (productId, PRN_VALUE) {
  return firestore.doc(`/products/${productId}`).update({
    prn: PRN_VALUE,
    createdOn: admin.firestore.FieldValue.serverTimestamp()
  })
}

module.exports = {
  productPRN: productPRN,
  randomPendingBillToken: randomPendingBillToken
}
