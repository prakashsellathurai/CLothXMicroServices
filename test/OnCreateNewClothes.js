var admin = require('firebase-admin')

var serviceAccount = require('../functions/shared/environment/clothxnet-firebase-adminsdk-wkk1h-a27faaab6d.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://clothxnet.firebaseio.com'

})
var firestore = admin.firestore()

firestore
  .collection('users')
  .where('uid', '==', 'rQVXK9Rn6qOZrIXfjURRgMCcNSr2')
  .get().then(docs => {
    let promises = []
    docs.forEach(doc => {
      if (doc.exists) { promises.push(doc.data()) }
    })
    return Promise.all(promises)
  })
  .then(array => array[0])
  .then(val => {
    console.log(val)
  })
