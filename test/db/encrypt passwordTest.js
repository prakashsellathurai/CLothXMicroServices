var admin = require('firebase-admin')

var serviceAccount = require('../../functions/environment/clothxnet-firebase-adminsdk-wkk1h-a27faaab6d.json')
var SHA256 = require('../../functions/node_modules/crypto-js/sha256')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://clothxnet.firebaseio.com'

})
function hashPassword (password) {
  return SHA256(password).toString().toLowerCase()
}
var firestore = admin.firestore()
function encryptThepasswordOnce (sid, EmployeePhoneNUmber, password) {
  let hashedpassword = hashPassword(password)
  return firestore.collection(`stores/${sid}/employees/`).doc(`${EmployeePhoneNUmber}`).update({password: hashedpassword})
}
encryptThepasswordOnce(1258, 9843158807, 123456789)
