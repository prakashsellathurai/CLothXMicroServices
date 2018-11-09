const db = require('./db')
const firestore = db.firestore

function razorPayId (storeId, razorPayId) {
  return firestore.doc(`stores/${storeId}`).update({
    razorPayPaymentId: razorPayId
  })
}
function FlipkartAccessCredentials (
  storeId,
  clientId,
  clientSecret,
  accessToken
) {
  let obj = {
    accessToken: `${accessToken}`,
    appId: `${clientId}`,
    appSecret: `${clientSecret}`
  }
  return firestore.doc(`stores/${storeId}/integrations/flipkart`).update(obj)
}
module.exports = {
  razorPayId: razorPayId,
  FlipkartAccessCredentials: FlipkartAccessCredentials
}
