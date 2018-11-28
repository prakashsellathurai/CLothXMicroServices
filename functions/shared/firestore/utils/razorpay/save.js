let admin = require('firebase-admin')
let firestore = admin.firestore()

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
