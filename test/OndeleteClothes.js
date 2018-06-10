var admin = require('firebase-admin')

var serviceAccount = require('../functions/environment/clothxnet-firebase-adminsdk-wkk1h-a27faaab6d.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://clothxnet.firebaseio.com'

})
var firestore = admin.firestore()
function ondeleteHandler (userRef, clothRef, crnContentref, crn, userId, clothId) {
  return emptyTheCrnContentIndex(crnContentref, crn).then((result) => {
    return pushTodeletedIndexes(userRef, crn)
  })
}
function emptyTheCrnContentIndex (crnContentref, crn) {
  return crnContentref.doc(`${crn}`).update({clothRef: '', id: ''})
}
function pushTodeletedIndexes (userRef, crn) {
  return getCRNIndex(userRef).then((crnIndex) => {
    var array = (crnIndex.deletedIndex) ? crnIndex.deletedIndex : []
    let deletedIndex = (CheckDeletedIndex(crnIndex)) ? array.slice() : []
    console.log(deletedIndex)
    deletedIndex.push(crn)
    return UpdateCrnIndex(userRef, deletedIndex)
  })
}
function UpdateCrnIndex (userRef, deletedIndex) {
  return userRef.set({'crnIndex': {'deletedIndex': deletedIndex}}, { merge: true })
}
function CheckDeletedIndex (crnIndex) {
  return (_has(crnIndex, 'deletedIndex'))
}
function _has (object, key) {
  return object ? hasOwnProperty.call(object, key) : false
}
function getCRNIndex (userRef) {
  return userRef.get().then((doc) => { return doc.data().crnIndex })
}
var userId = 'ZPnEUNe3l7NR0LYFj0dH'
var clothId = 'Jd99Et9iQdiKzTcDBtZq' // Math.random().toString(36).substr(2, 19)
var userRef = firestore.collection('user').doc(userId)
var clothRef = firestore.collection(`user/${userId}/clothes`).doc(`${clothId}`)
var crnContentref = firestore.collection(`user/${userId}/crnContent`)

function deleteclothes (userRef, clothRef, crnContentref, userId, clothId) {
  let array = Array.from(new Array(7), (val, index) => index)
  let promise = []
  for (let index = 1; index < array.length; index++) {
    promise.push(ondeleteHandler(userRef, clothRef, crnContentref, `${index}`, userId, clothId))
  }
  return Promise.all([promise])
}
deleteclothes(userRef, clothRef, crnContentref, userId, clothId)
