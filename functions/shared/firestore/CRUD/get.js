const db = require('./db')
const firestore = db.firestore
function userEmailByUUID (uid) {
  return firestore
    .collection('users')
    .where('uid', '==', `${uid}`)
    .get()
    .then(docs => {
      let promises = []
      docs.forEach(doc => {
        if (doc.exists) {
          promises.push(doc.data())
        }
      })
      return Promise.all(promises)
    })
    .then(array => array[0])
    .then(doc => doc.email)
}
function razorPayCustomerId (storeId) {
  return firestore
    .doc(`stores/${storeId}`)
    .get()
    .then(doc => doc.data().razorPayPaymentId)
}

module.exports = {
  userEmailByUUID: userEmailByUUID,
  razorPayCustomerId: razorPayCustomerId
}
