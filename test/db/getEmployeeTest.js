var admin = require('firebase-admin')

var serviceAccount = require('../../functions/environment/clothxnet-firebase-adminsdk-wkk1h-a27faaab6d.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://clothxnet.firebaseio.com'

})
var firestore = admin.firestore()
function GetOwner (sid) {
  return firestore.collection(`stores/${sid}/employees/`).where('role', '==', 'owner').get()
}

function GetPhoneNumber (storeId) {
  return GetOwner(storeId)
}
function extractDocID (doc) {
  return doc.docs.forEach(doc => {
    console.log(doc.id)
    return doc.id
  })
}
GetOwner(10025).then(doc => extractDocID(doc)).then(val => {
  console.log(val)
})
