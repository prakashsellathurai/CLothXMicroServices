var functions = require('firebase-functions')
var admin = require('firebase-admin')
var firestore = admin.firestore()
module.exports = functions
  .firestore
  .document('/stores/{storeId}/products/{productId}')
  .onCreate((snap, context) => PrnAssigner(snap, context))

function PrnAssigner (snap, context) {
  let prn = RandomGen(5)
  let storeId = context.params.storeId
  let docRef = `/stores/${context.params.storeId}/products/${context.params.productId}`
  return prnCheckLoop(prn, storeId).then(rand => UpdateprnVal(docRef, rand))
}
function prnCheckLoop (InitialPrnToTest, storeID) {
  return new Promise(function (resolve) {
    firestore
      .collection(`/stores/${storeID}/products`)
      .where('prn', '==', `${InitialPrnToTest}`)
      .get()
      .then(queryResult => resolve((queryResult.empty) ? (InitialPrnToTest) : (prnCheckLoop(RandomGen(5), storeID))))
  })
}
function UpdateprnVal (docRef, val) {
  return firestore.doc(docRef).update({prn: val})
}
function RandomGen (Length) {
  var keylistalpha = 'bcdfghjklmnpqrstvwxyz'
  var temp = ''
  for (var i = 0; i < Length; i++) { temp += keylistalpha.charAt(Math.floor(Math.random() * keylistalpha.length)) }
  temp = temp.split('').sort(function () { return 0.5 - Math.random() }).join('')
  return temp
}
