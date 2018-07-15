
var admin = require('firebase-admin')

var serviceAccount = require('../../../functions/environment/clothxnet-firebase-adminsdk-wkk1h-a27faaab6d.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://clothxnet.firebaseio.com'

})
var firestore = admin.firestore()
function storeQueryBySid (sid) {
  return firestore.collection('stores').where('sid', '==', sid).get().then(val => {
    let promises = []
    if (val.empty) {
      return Promise.resolve([1000])
    } else {
      val.docs.forEach(doc => {
        promises.push(doc.id)
      })
      return Promise.all(promises)
    }
  })
}

function checkIfstoreExist (sid) {
  return storeQueryBySid(sid).then(arr => {
    return arr.length > 0
  })
}
checkIfstoreExist(1000).then(al => console.log(al))
