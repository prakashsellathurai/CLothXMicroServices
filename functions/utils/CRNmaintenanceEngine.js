'use strict'
const admin = require('firebase-admin')
try { admin.initializeApp() } catch (e) {}
const db = admin.firestore()

function adder (userId, clothId, clothData) {
  const userRef = db.collection(`user/`).doc(`${userId}`)
  let userdoc = userRef.get()
  userdoc.then(doc => {
    var crn = getCRNINDEX(doc)
    if (checkIfArray(crn)) {
      crn = pushCrnRef(crn)
      return userdoc.update(userRef, {crnIndex: crn})
    } else {
      /* userRef.set({crnIndex: []}).then((val) => {
        console.log(val)
        var crn = doc.data().crnIndex
        crn.push(`user/${userId}/clothes/${clothId}`)
        // let modifiedcrn = crn.slice()
        // modifiedcrn.push(`user/${userId}/clothes/${clothId}`)
        return t.update(userRef, {crnIndex: crn})
     } */
    }
  })
}

function purger () {

}
function autoIndexer () {

}
function checkIfArray (x) {
  return typeof x !== 'undefined' && x instanceof Array
}
function getCRNINDEX (doc) {
  return doc.data().crnIndex
}
function pushCrnRef (arr, userId, clothId) {
  return arr.push(`user/${userId}/clothes/${clothId}`)
}
module.exports = {
  adder: adder,
  purger: purger,
  autoIndxer: autoIndexer
}
