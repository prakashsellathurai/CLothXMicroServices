const firebase = require('firebase-admin')

var serviceAccountSource = require('./../functions/shared/environment/clothxnet-firebase-adminsdk-wkk1h-a27faaab6d.json') // source DB key
var serviceAccountDestination = require('./../functions/shared/environment/clothxtest-firebase-adminsdk-0bpps-e18156c08d.json') // destiny DB key

const sourceAdmin = firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccountSource)
})

const destinationAdmin = firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccountDestination)
}, 'destination')

const schema = {
  customers: {},
  discounts: {},
  invoices: {},
  products: {},
  stores: {
    customers: {}
  },
  users: {}
}

var source = sourceAdmin.firestore()
var destination = destinationAdmin.firestore()

const copy = (sourceDBrep, destinationDBref, aux) => {
  return Promise.all(Object.keys(aux).map((collection) => {
    return sourceDBrep.collection(collection).get()
      .then((data) => {
        let promises = []
        data.forEach((doc) => {
          const data = doc.data()
          promises.push(
            destinationDBref.collection(collection).doc(doc.id).set(data).then((data) => {
              return copy(sourceDBrep.collection(collection).doc(doc.id),
                destinationDBref.collection(collection).doc(doc.id),
                aux[collection])
            })
          )
        })
        return Promise.all(promises)
      })
  }))
}

copy(source, destination, schema).then(() => {
  console.log('copied')
})
