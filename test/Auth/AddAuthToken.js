var admin = require('firebase-admin')

var serviceAccount = require('../config/clothxtest-firebase-adminsdk-0bpps-d5b0ba2238.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://clothxtest.firebaseio.com'

})
var jwt = require('../../functions/node_modules/jwt-simple')
var Constants = require('../../functions/environment/CONSTANTS')
var secret = Constants.SECRET_TOKEN
var firestore = admin.firestore()
function getOwner (sid) {
  return firestore.collection('stores').doc(`${sid}`).collection('employee').where('role', '==', 'owner')
    .get().then((snap) => {
      return snap.docs.forEach(doc => {
        console.log(encode(doc.data().mobileNo,))
      })
    })
} function encode (phoneNumber, password, sid) { // encodes the json data
  var payload = {
    phonenumber: phoneNumber,
    password: password,
    sid: sid
  }
  return jwt.encode(payload, secret)
}

getOwner(1000)
