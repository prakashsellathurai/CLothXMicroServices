'use strict'
const admin = require('firebase-admin')
try { admin.initializeApp() } catch (e) {}
const db = admin.firestore()

function adder (userId, clothId, clothData, userRef) {
  return db.runTransaction(t => {
    return t.get(userRef)
      .then(doc => {
        var crn = doc.data().crnIndex
        if (typeof crn !== 'undefined' && crn instanceof Array) {
          var modifiedcrn = crn.slice()
          modifiedcrn.push(`user/${userId}/clothes/${clothId}`)
          return t.update(userRef, {crnIndex: modifiedcrn})
        } else {
          admin.firestore().collection('user').doc(userId).set({crnIndex: []}).then((val) => {
            console.log(val)
            var crn = doc.data().crnIndex
            crn.push(`user/${userId}/clothes/${clothId}`)
            // let modifiedcrn = crn.slice()
            // modifiedcrn.push(`user/${userId}/clothes/${clothId}`)
            return t.update(userRef, {crnIndex: crn})
          })
        }
      })
  })
}
function purger () {

}
function autoIndexer () {

}
module.exports = {
  adder: adder,
  purger: purger,
  autoIndxer: autoIndexer
}
