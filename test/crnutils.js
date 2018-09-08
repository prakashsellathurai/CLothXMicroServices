
var admin = require('firebase-admin')

var serviceAccount = require('../functions/shared/environment/clothxtest-firebase-adminsdk-0bpps-e18156c08d.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://clothxtest.firebaseio.com'

})
var firestore = admin.firestore()

function getLoc (loc) {
  firestore
    .doc(loc)
    .get()
    .then(doc => {
      randomGenParser(doc.id)
    })
}
function RandomGen (Length) {
  var keylistalpha = 'bcdfghjklmnpqrstvwxyz'
  var temp = ''
  for (var i = 0; i < Length; i++) { temp += keylistalpha.charAt(Math.floor(Math.random() * keylistalpha.length)) }
  temp = temp.split('').sort(function () { return 0.5 - Math.random() }).join('')
  return temp
}
function randomGenParser (id) {
  console.log(id.substr(5))
}
function prnCheckLoop (InitialPrnToTest, snap) {
  return new Promise(function (resolve) {
    firestore
      .collection(`/stores/${snap.storeId}/products`)
      .where('prn', '==', `${InitialPrnToTest}`)
      .get()
      .then(queryResult => resolve((queryResult.empty) ? (InitialPrnToTest) : (prnCheckLoop(RandomGen(5), snap))))
  })
}
function UpdatePrn (storeID) {
  return firestore.collection()
}
function AddProductEntry (entry) {
  return firestore.collection('stores/1000/products').add({prn: entry})
}
AddProductEntry(11)
  .then(() => prnCheckLoop(1333331, {storeId: 1000}).then(val => console.log(val)))
