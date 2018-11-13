const db = require('./../../CRUD/index')
const firestore = db.firestore

function id (storeId) {
  return firestore
    .doc(`stores/${storeId}`)
    .get()
    .then((docRef) => docRef.data().razorPayPaymentId)
}
module.exports = {
  id: id
}
