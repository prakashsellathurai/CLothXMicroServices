const db = require('./db')
const firestore = db.firestore
const admin = db.admin
const utils = require('./../../utils/general_utils')
function StoreInfoToUser (uid, storeId) {
  let docRef = firestore.collection('users').where('uid', '==', `${uid}`)

  return firestore.runTransaction(t => {
    return t
      .get(docRef)
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
        let registeredStores = userDoc.registerOf == null
          ? []
          : userDoc.registerOf
        let storeArray = utils.MergeAndRemoveDuplicatesArray(
          registeredStores,
          storeId
        )
        let dataToUpdate = (userDoc.isRegister == null
          ? false
          : userDoc.isRegister)
          ? {
            registerOf: storeArray
          }
          : {
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
      })
  })
}
module.exports = {
  StoreInfoToUser: StoreInfoToUser
}
