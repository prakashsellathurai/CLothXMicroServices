
var admin = require('firebase-admin')

var serviceAccount = require('../functions/environment/clothxnet-firebase-adminsdk-wkk1h-a27faaab6d.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://clothxnet.firebaseio.com'

})
var firestore = admin.firestore()
function GetCRNINDEX (userRef) {
  return userRef.get().then((doc) => {
    console.log(extractCrnIndex(doc).nextIndexPointer, Array.isArray(extractCrnIndex(doc).deletedIndex) ? (extractCrnIndex(doc).deletedIndex) : [])
  })
}
function extractCrnIndex (doc) {
  return doc.data().crnIndex
}
var userId = 'ZPnEUNe3l7NR0LYFj0dH'

var userRef = firestore.collection('user').doc(userId)

console.log(GetCRNINDEX(userRef))

// Simple binary search algorithm
function binarySearch (arr, l, r, x) {
  if (r >= l) {
    let mid = l + (r - l) / 2
    if (arr[mid] === x) { return mid }
    if (arr[mid] > x) { return binarySearch(arr, l, mid - 1, x) }
    return binarySearch(arr, mid + 1, r, x)
  }
  return -1
}
function findPos (arr, key) {
  var l = 0
  var h = 1
  let val = arr[0]

  // Find h to do binary search
  while (val < key) {
    l = h // store previous high
    h = 2 * h // double high index
    val = arr[h] // update new val
  }

  // at this point we have updated low and
  // high indices, Thus use binary search
  // between them
  return binarySearch(arr, l, h, key)
}
function _has (object, key) {
  return object ? hasOwnProperty.call(object, key) : false
}
