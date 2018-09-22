var admin = require('firebase-admin')

var serviceAccount = require('../functions/shared/environment/clothxnet-firebase-adminsdk-wkk1h-a27faaab6d.json')

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
function prnCheckLoop () {
  let PRN_VALUE_TO_TEST = RandomPRNgenerator()
  return new Promise(function (resolve) {
    firestore
      .collection(`products`)
      .where('prn', '==', `${PRN_VALUE_TO_TEST}`)
      .get()
      .then(queryResult => resolve((queryResult.empty) ? (PRN_VALUE_TO_TEST) : (prnCheckLoop())))
  })
}
function RandomPRNgenerator () {
  let Length = 5
  var keylistalpha = 'bcdfghjklmnpqrstvwxyz'
  var temp = ''
  for (var i = 0; i < Length; i++) { temp += keylistalpha.charAt(Math.floor(Math.random() * keylistalpha.length)) }
  temp = temp.split('').sort(function () { return 0.5 - Math.random() }).join('')
  return temp
}
prnCheckLoop ().then(val => console.log(val))