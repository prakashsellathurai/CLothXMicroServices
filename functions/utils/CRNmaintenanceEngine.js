'use strict'
const admin = require('firebase-admin')
try { admin.initializeApp() } catch (e) {}
const db = admin.firestore()

function adder (userId, clothId, clothData) {
  console.log('adder entry')
  var userDocRef = db.collection('user').doc(`${userId}`)
  var clothDocRef = db.doc(`user/${userId}/clothes/${clothId}`)

  return userDocRef.get().then(userdoc => {
    console.log('check if user exist entry')
    return checkIfUserDocExist(userDocRef, userdoc, userId, clothId)
  }).then((crnIndex) => {
    console.log('check if user exist passed')
    return CrnIndexDatabaseupdater(userDocRef, crnIndex)
  }).then((val) => {
    console.log('crn IndexDatabase updater passed')
    return CrnValueForClothUpdater(clothDocRef, val)
  })
}

function purger () {
}
function CrnValueForClothUpdater (clothDocRef, val) {
  let data = {crn: val}
  return clothDocRef.set(data)
}
function CrnIndexDatabaseupdater (userDocRef, crnIndex) {
  userDocRef.update({crnIndex: crnIndex})
  return crnIndex.length // return the current poistion of the array
}
function autoIndexer (userId) {
  var userDocRef = db.collection('user').doc(`${userId}`)
  userDocRef.get().then(userdoc => {
    // var crnIndex = userdoc.data().crnIndex
  })
}
function checkIfObject (x) {
  return typeof x !== 'undefined' && x instanceof Object
}
function pushTheReferenec (obj, userId, clothId) {
  console.log('push the refrenec /  /  /  /')
  var referenceToBePushed = `user/${userId}/clothes/${clothId}`
  let indexval = {
    allocated: true,
    ref: referenceToBePushed
  }
  let index = getIndex(obj)
  console.log(index)
  Object.defineProperty(obj, index, indexval)
  var user = db.collection('user').doc(`${userId}`).get()
  return user.then(doc => {
    let crnIndex = doc.data().crnIndex
    let nextVal = UpdateIndexValue(crnIndex)
    console.log(nextVal)
    let data = { 'crnIndex.nextIndex': nextVal }
    // console.log(data.crnIndex.nextIndex)
    console.log('before updationf nextIndex')
    return (data, nextVal)
  }).then((data, nextVal) => {
    const userRef = db.collection('user').doc(`${userId}`)
    return userRef.update({ 'crnIndex.nextIndex': nextVal }).then(ref => {
      console.log('crnIndex updated')
      return nextVal
    }).catch((err) => { console.log(err) }).catch(err => console.log('err at push the reference' + err))
  })
}

function checkIfUserDocExist (userDocRef, userdoc, userId, clothId) {
  if (!userdoc.exists) {
    console.log('No such document!')
    return 0
  } else {
    return CreateOrReturnCRNIndex(userDocRef, userdoc, userId, clothId)
  }
}
function CreateOrReturnCRNIndex (userDocRef, userdoc, userId, clothId) {
  console.log('userdocExists')
  var crnIndex = userdoc.data().crnIndex
  console.log('crn Index vlue' + crnIndex)
  console.log('if crnIndex is object' + checkIfObject(crnIndex))
  if (checkIfObject(crnIndex)) {
    return pushTheReferenec(crnIndex, userId, clothId)
  } else {
    console.log('crnIndex as a object does not exstit')
    let crnIndex = initiatecrnIndex()
    let data = {crnIndex: crnIndex}
    return userDocRef.set(data).then((ref) => {
      return pushTheReferenec(crnIndex, userId, clothId)
    })
  }
}
function initiatecrnIndex () {
  let crnIndex = {
    nextIndex: 1
  }
  console.log('null crn Index value' + crnIndex)
  console.log(crnIndex.nextIndex)
  console.log('initializing empty object done')
  return crnIndex
}
function getIndex (crnIndex) {
  return crnIndex.nextIndex
}

function UpdateIndexValue (crnIndex) {
  console.log('index value updated')
  var nextVal = crnIndex.nextIndex
  nextVal++
  return nextVal
}
module.exports = {
  adder: adder,
  purger: purger,
  autoIndxer: autoIndexer
}
