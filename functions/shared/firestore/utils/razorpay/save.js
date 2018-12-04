let admin = require('firebase-admin')
let firestore = admin.firestore()

function id (emailId, razorPayId) {
  return firestore
    .doc(`users/${emailId}`)
    .update({
      razorPayPaymentId: razorPayId
    })
}
module.exports = {
  id: id
}
