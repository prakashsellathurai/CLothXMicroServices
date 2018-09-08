var functions = require('firebase-functions')
var admin = require('firebase-admin')
var firestore = admin.firestore()
module.exports = functions
  .firestore
  .document('/stores/{storeId}/products/{productId}')
  .onCreate((snap, context) => PrnAssigner(snap, context))

function PrnAssigner (snap, context) {
  let prn = RandomGen(5)

}
function  prnCheckLoop(prn_To_test) {
    
}
function RandomGen (Length) {
  var keylistalpha = 'bcdfghjklmnpqrstvwxyz'
  var temp = ''
  for (var i = 0; i < Length; i++) { temp += keylistalpha.charAt(Math.floor(Math.random() * keylistalpha.length)) }
  temp = temp.split('').sort(function () { return 0.5 - Math.random() }).join('')
  return temp
}
