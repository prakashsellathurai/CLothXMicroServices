const db = require('./../../CRUD/index')
const firestore = db.firestore
function id (storeId, razorPayId) {
  return firestore
    .doc(`stores/${storeId}`)
    .update({
      razorPayPaymentId: razorPayId
    })
}
module.exports = {
  id: id
}
