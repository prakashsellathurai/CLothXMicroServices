let admin = require('firebase-admin')
let firestore = admin.firestore()

function id (storeId) {
  return firestore
    .doc(`stores/${storeId}`)
    .get()
    .then((docRef) => docRef.data().razorPayPaymentId)
}
module.exports = {
  id: id
}
