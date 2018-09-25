var admin = require('firebase-admin')

var serviceAccount = require('../functions/shared/environment/clothxnet-firebase-adminsdk-wkk1h-a27faaab6d.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://clothxnet.firebaseio.com'

})
var firestore = admin.firestore()
function ReduceProductQuantity (storeId, prn, size, singleUnitPrice, quantityToReduce) {
  let productDocRef = firestore
    .collection(`products`)
    .where('prn', '==', `${prn}`)
    .where('storeId', '==', `${storeId}`)
  return firestore
    .runTransaction(transaction => {
      return transaction
        .get(productDocRef)
        .then((docs) => {
          return docs
            .forEach(doc => {
              let ssp = doc.data().ssp
              let reducedssp = reduceStock(ssp, singleUnitPrice, size, quantityToReduce)
              return transaction.update(doc.ref, {ssp: reducedssp})
            })
        })
    })
}
ReduceProductQuantity('LHAT19sYtyrApk1Va63E', 'qvlgb', 'XL', 677, 1)
function reduceStock (ssp, price, size, quantityToReduce) {
  for (var i = 0; i < ssp.length; i++) {
    if (ssp[i].price == price && ssp[i].size === size) {
      ssp[i].stock -= quantityToReduce
      return ssp
    }
  }
  return null
}
