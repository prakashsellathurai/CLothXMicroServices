var admin = require('firebase-admin')

var serviceAccount = require('../../functions/environment/clothxnet-firebase-adminsdk-wkk1h-a27faaab6d.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://clothxnet.firebaseio.com'

})
var firestore = admin.firestore()
function GetOwner (sid) {
  return firestore.collection(`stores/${sid}/employees/`).where('role', '==', 'owner')
}
GetOwner(1000).then(data => console.log(data))
