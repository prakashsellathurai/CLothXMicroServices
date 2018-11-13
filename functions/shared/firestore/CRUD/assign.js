const db = require('./index')
const firestore = db.firestore
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
module.exports = {
  randomPendingBillToken: randomPendingBillToken
}
