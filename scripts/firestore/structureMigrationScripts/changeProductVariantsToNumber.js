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
        docs.forEach(doc => {
          let variants = doc.data().variants
          for (let index = 0; index < variants.length; index++) {
            const variant = variants[index]
            variant['purchasedPrice'] *= 1
            variant['sellingPrice'] *= 1
            variant['stock'] *= 1
          }
          t.update(doc.ref, { variants: variants })
        })
      })
  })
