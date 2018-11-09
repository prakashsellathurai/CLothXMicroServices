const db = require('./db')
const firestore = db.firestore

function updateReturnCount (customerNo, totalReturn) {
  let docRef = firestore
    .doc(`customers/${customerNo}`)
  return firestore
    .runTransaction(t => {
      return t.get(docRef)
        .then((doc) => doc.data().totalProductsReturn)
        .then((currentReturnState) => t.set(docRef, { totalProductsReturn: currentReturnState + totalReturn },
          { merge: true }))
    })
}


module.exports = {
  updateCustomer: updateCustomer,
  updateReturnCount: updateReturnCount
}
