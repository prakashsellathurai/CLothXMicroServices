var admin = require('firebase-admin')

var serviceAccount = require('../functions/shared/environment/clothxtest-firebase-adminsdk-0bpps-e18156c08d.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://clothxtest.firebaseio.com'

})
var firestore = admin.firestore()
function Addstore (storediD) {
  return firestore
    .doc(`stores/${storediD}`)
    .set({
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    })
}
// ReduceProductQuantity('1000', 'sbzhv', 1)
 Addstore(1002)
// console.log(firestore.FieldValue.serverTimestamp())