var admin = require('firebase-admin')

var serviceAccount = require('../functions/shared/environment/clothxnet-firebase-adminsdk-wkk1h-a27faaab6d.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://clothxnet.firebaseio.com'

})
var firestore = admin.firestore()
function ReduceProductQuantity (storeId, prn, quantityToReduce) {
  let productDocRef = firestore
    .collection(`stores/${storeId}/products`)
    .where('prn', '==', `${prn}`)
  return firestore
    .runTransaction(transaction => {
      return transaction
        .get(productDocRef)
        .then((docs) => {
    
          return docs.forEach(doc => {
            console.log(doc.data())
            let initialStock = doc.data().stock
            let updatedStock = initialStock - quantityToReduce
            console.log(doc.ref)
            return // transaction.update(productDocRef, {prn: updatedStock})
          })
       
          // 
        })
    })
}

ReduceProductQuantity('9UtL9dt2WaGbsdhqPApe', 'sbzhv', 1)