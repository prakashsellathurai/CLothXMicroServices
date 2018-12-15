let admin = require('firebase-admin')
let firestore = admin.firestore()
function storeInfoToUser (uid, storeId) {
  let docRef = firestore
    .collection('users')
    .where('uid', '==', `${uid}`)

  return firestore.runTransaction(t => {
    return t.get(docRef)
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
      .then(userDoc => {
        if (typeof userDoc === 'undefined') {
          console.log('log ==> make sure user saved with given uuid')
          return Promise.resolve(0)
        }
        let registeredStores = (userDoc.registerOf == null) ? [] : userDoc.registerOf
        let storeArray = MergeAndRemoveDuplicatesArray(registeredStores, storeId)
        let dataToUpdate = ((userDoc.isRegister == null) ? false : userDoc.isRegister) ? {
          registerOf: storeArray
        } : {
          isRegister: true,
          registerOf: storeArray,
          role: 'Register'
        }
        let userDocRef = firestore.doc(`users/${userDoc.email}`)
        t.update(userDocRef, dataToUpdate)
        let StorePropertyObj = {
          verificationStatus: 'pending',
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        }
        let StoreDOcRef = firestore.doc(`stores/${storeId}`)
        t.update(StoreDOcRef, StorePropertyObj)
        return userDoc.email
      }).catch(e => console.error(e))
  })
}
function MergeAndRemoveDuplicatesArray (array, string) {
  var c = array.concat(string)
  return c.filter(function (item, pos) {
    return c.indexOf(item) === pos
  })
}

module.exports = {
  storeInfoToUser: storeInfoToUser
}
