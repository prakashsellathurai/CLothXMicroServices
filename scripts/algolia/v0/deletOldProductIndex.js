const firebase = require('firebase-admin')

var serviceAccountSource = require('./../../../functions/shared/environment/clothxnet-firebase-adminsdk-wkk1h-a27faaab6d.json') // source DB key
const firestoreAdmin = firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccountSource)
})
const firestore = firestoreAdmin.firestore()
const product_index = require('./../../../functions/shared/utils/integrations/algolia/initIndex').product.unsorted
let productRef = firestore.collection('products')
firestore
  .runTransaction(t => {
    return t.get(productRef)
      .then((docs) => {
        let promises = []
        docs.forEach(doc => promises.push(doc.id))
        return Promise.all(promises)
      })
  }).then((ids) => product_index.clearIndex())
  .then((content) => console.log(content))
