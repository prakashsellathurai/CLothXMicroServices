const firebase = require('firebase-admin')

var serviceAccountSource = require('./../functions/shared/environment/clothxnet-firebase-adminsdk-wkk1h-a27faaab6d.json') // source DB key
var serviceAccountDestination = require('./../functions/shared/environment/clothxtest-firebase-adminsdk-0bpps-e18156c08d.json') // destiny DB key

const sourceAdmin = firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccountSource)
})

const destinationAdmin = firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccountDestination)
}, 'destination')

const DatabaseSchema = {
  customers: {},
  discounts: {},
  invoices: {},
  products: {},
  stores: {
    customers: {},
    sms: {}
  },
  users: {},
  people: {}
}

var source = sourceAdmin.firestore()
var destination = destinationAdmin.firestore()

const copyFirestoreDb = (sourceDBrep, destinationDBref, aux) => {
  return Promise.all(Object.keys(aux).map((collection) => {
    return sourceDBrep.collection(collection).get()
      .then((data) => {
        let promises = []
        data.forEach((doc) => {
          const data = doc.data()
          promises.push(
            destinationDBref.collection(collection).doc(doc.id).set(data).then((data) => {
              return copyFirestoreDb(sourceDBrep.collection(collection).doc(doc.id),
                destinationDBref.collection(collection).doc(doc.id),
                aux[collection])
            })
          )
        })
        return Promise.all(promises)
      })
  }))
}

copyFirestoreDb(source, destination, DatabaseSchema).then(() => {
  console.log('copied')
})
