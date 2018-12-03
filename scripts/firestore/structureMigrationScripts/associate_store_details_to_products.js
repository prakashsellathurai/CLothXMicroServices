const firebase = require('firebase-admin')

var serviceAccountSource = require('./../../../functions/shared/environment/clothxnet-firebase-adminsdk-wkk1h-a27faaab6d.json') // source DB key
const firestoreAdmin = firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccountSource)
})
const firestore = firestoreAdmin.firestore()
let productRef = firestore.collection('products')
firestore
  .runTransaction(t => {
    return t.get(productRef)
      .then((docs) => {
        let promises = []
        docs.forEach(doc => {
          let storeId = doc.data().storeId
          let storeRef = firestore.doc(`stores/${storeId}`)
          let productRef = doc.ref
          promises.push(t.get(storeRef)
            .then(doc => {
              let obj = {
                storeDetails: {
                  id: doc.id,
                  name: doc.data().storeName,
                  location: doc.data().location,
                  address: doc.data().address
                }
              }
              t.update(productRef, obj)
            }))
        })
        return Promise.all(promises)
      })
  }).then(() => {
    console.log('done')
  }).catch((err) => {
    console.log(err)
  })
