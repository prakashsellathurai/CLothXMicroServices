var admin = require('firebase-admin')

var serviceAccount = require('../functions/environment/clothxnet-firebase-adminsdk-wkk1h-a27faaab6d.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://clothxnet.firebaseio.com'

})
var firestore = admin.firestore()
function UpdateCRNIndex (userRef, position) {
  return GetCRNINDEX(userRef).then((crnIndex) => {
    console.log(crnIndex.deletedIndex)
    process.exit(1)
    let updatedDeletedIndex = (isUndefined(deletedIndex)) ? popPositionFromDeletedIndex(deletedIndex, position) : []
    if (isUndefined(updatedDeletedIndex)) { return userRef.update({ 'crnIndex.nextIndexPointer': position + 1 }) } else {
      return userRef.set({'crnIndex.nextIndexPointer': position + 1, 'crnIndex.deletedIndex': removeDuplicates(updatedDeletedIndex)})
    }
  })
}
// get crnIndex
function GetCRNINDEX (userRef) {
  return userRef.get().then((doc) => {
// console.log(Array.isArray(extractCrnIndex(doc).deletedIndex) ? (extractCrnIndex(doc).deletedIndex) : [])
    let deletedIndex = Array.isArray(extractCrnIndex(doc).deletedIndex) ? (extractCrnIndex(doc).deletedIndex) : []
    let nextIndexPointer = extractCrnIndex(doc).nextIndexPointer
    return { nextIndexPointer, deletedIndex }
  })
}
function popPositionFromDeletedIndex (array, position) {
  var index = findElement(array, position)
  if (index > -1) {
    array.splice(index, 1)
  }
  return array
}
// Function to implement search operation
function findElement (arr, key) {
  var i
  for (i = 0; i < arr.length; i++) {
    if (arr[i] === key) { return i }
  }

  return undefined
}
function removeDuplicates (arr) {
  return [...new Set(arr)]
}
function extractCrnIndex (doc) {
  return doc.data().crnIndex
}

function isUndefined (obj) {
  return obj === false || obj === null || obj === undefined
}
var userId = 'ZPnEUNe3l7NR0LYFj0dH'

var userRef = firestore.collection('user').doc(userId)
var position = 1
UpdateCRNIndex(userRef, position)
