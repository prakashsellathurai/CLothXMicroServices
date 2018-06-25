
var admin = require('firebase-admin')

var serviceAccount = require('../../functions/environment/clothxnet-firebase-adminsdk-wkk1h-a27faaab6d.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://clothxnet.firebaseio.com',
  storageBucket: 'clothxnet.appspot.com'
})

// test data for DI
var firestore = admin.firestore()
var storage = admin.storage().bucket()
function getuploadedfilePath (sid) {
  return firestore.collection(`stores`).doc(`${sid}`).get().then((snap) => {
    return snap.data().uploads
  })
}
getuploadedfilePath(1000).then(val => {
  let logoPath = val.logo
  let images = val.images
  let path = storage.file('stores/1000/clothes/cloth_1529931930205.jpg').getSignedUrl(
    {
      action: 'read',
      expires: '03-09-2080'
    }
  )
  path.then(val => {
    console.log(val[0])
  })
})
