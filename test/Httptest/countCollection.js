// ============================================= mock firebase env ==============================//
var admin = require('firebase-admin')

var serviceAccount = require('../config/clothxtest-firebase-adminsdk-0bpps-d5b0ba2238.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://clothxtest.firebaseio.com'

})
var firestore = admin.firestore()
// --------------------------------------------------- env end add this shit every test script --------
function CountCollection (collection) {
  return firestore.collection(collection).get().then(snap => {
    return snap.size
  })
}
CountCollection('stores').then(val => console.log(val))
