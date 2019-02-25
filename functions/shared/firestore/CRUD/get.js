let admin = require('firebase-admin')
let firestore = admin.firestore()

function UserEmailByUUID (uid) {
  return firestore
    .collection('users')
    .where('uid', '==', `${uid}`)
    .get()
    .then(docs => {
      let promises = []
      docs
        .forEach(doc => {
          if (doc.exists) {
            promises.push(doc.data())
          }
        })
      return Promise.all(promises)
    })
    .then(array => array[0])
    .then((doc) => doc.email)
}
/**
 *gets the products related to storeId
 * @param {String} storeId String representing the store
 */
function ProductInStore (storeId) {
  return firestore
    .collection('products')
    .where('storeId', '==', `${storeId}`)
    .get()
    .then((docs) => {
      let promises = []
      docs.docs
        .forEach(doc => {
          promises
            .push(doc
              .data())
        })
      return Promise.all(promises)
    })
}
function StoreData (storeId) {
  return firestore
    .collection('stores')
    .doc(`${storeId}`)
    .get()
    .then(doc => doc.data())
}
module.exports = {
  UserEmailByUUID: UserEmailByUUID,
  ProductInStore: ProductInStore,
  StoreData: StoreData
}
