var admin = require('firebase-admin')

var serviceAccount = require('../functions/environment/clothxnet-firebase-adminsdk-wkk1h-a27faaab6d.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://clothxnet.firebaseio.com'

})
var firestore = admin.firestore()
function OnCreateNewcCLothes (userId, clothId, crn) {
  // db refrerences
  var userRef = firestore.collection('user').doc(userId)
  var clothRef = firestore.collection(`user/${userId}/clothes`).doc(`${clothId}`)
  var crnContentref = firestore.collection(`user/${userId}/crnContent`)
  function OncreateHandler (userId, clothId, crn, userRef, clothRef, crnContentref) {
    return getNextIndexPointer(userRef).then(nextIndexPointer => {
      return (AssignNextPointerToClothId(nextIndexPointer, clothRef))
    }).then((position) => {
      return (AddCRNContentEntry(crnContentref, clothRef.path, position))
    }).then((position) => {
      return UpdateCRNIndex(userRef, position)
    })
  }
  // update crnIndex
  function UpdateCRNIndex (userRef, position) {
    return userRef.update({'crnIndex.nextIndexPointer': position + 1})
  }
  // Add crnContent Entry to crnContent
  function AddCRNContentEntry (crnContentref, clothRefPath, position) {
    return crnContentref.doc(`${position}`).set({clothRef: clothRefPath, id: position}).then(val => { return position })
  }
  // assign next pointer value to current clothid functions
  function AssignNextPointerToClothId (nextIndexPointer, clothRef) {
    return clothRef.set({crn: nextIndexPointer}, {merge: true}).then(val => { return nextIndexPointer })
  }

  // get next pointer related functions
  function getNextIndexPointer (userRef) {
    return userRef.get().then(doc => {
      return (_has(doc.data().crnIndex, 'nextIndexPointer')) ? doc.data().crnIndex.nextIndexPointer : InitializeNextPointer(userRef)
    })
  }
  function InitializeNextPointer (userRef) {
    return userRef.set({crnIndex: { nextIndexPointer: 1 }}).then(val => { return 1 })
  }
  return OncreateHandler(userId, clothId, crn, userRef, clothRef, crnContentref)
}
function _has (object, key) {
  return object ? hasOwnProperty.call(object, key) : false
}
/* testing scope */
var userId = 'ZPnEUNe3l7NR0LYFj0dH'
var clothId = 'Jd99Et9iQdiKzTcDBtZq' // Math.random().toString(36).substr(2, 19)
var crn = Math.random() * 10
console.log(clothId, crn)
function runMultiUsers (userId) {
  let array = Array.from(new Array(7), (val, index) => index)
  let promise = []
  for (let index = 1; index < array.length; index++) {
    promise.push(firestore.collection(`user/${userId}/clothes/`).doc(`${index}`).set({crn: 45}))
  }
  return Promise.all([promise])
}

function runMultipleclothIDcheck (userId) {
  let array = Array.from(new Array(7), (val, index) => index)
  let promise = []
  for (let index = 1; index < array.length; index++) {
  //    promise.push(OnCreateNewcCLothes(userId, index, 45))
  }
  return Promise.all([runMultiUsers(userId), promise])
}
Promise.all([runMultipleclothIDcheck(userId)])
