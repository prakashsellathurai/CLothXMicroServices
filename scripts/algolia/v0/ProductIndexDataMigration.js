const firebase = require('firebase-admin')

var serviceAccountSource = require('./../../../functions/shared/environment/clothxnet-firebase-adminsdk-wkk1h-a27faaab6d.json') // source DB key
const firestoreAdmin = firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccountSource)
})
const firestore = firestoreAdmin.firestore()
const product_index = require('./../../../functions/shared/utils/integrations/algolia/initIndex').productIndex
let productRef = firestore.collection('products')
firestore
  .runTransaction(t => {
    return t.get(productRef)
      .then((docs) => {
        let promises = []
        docs.forEach(doc => promises.push(doc.data()))
        return Promise.all(promises)
      })
  }).then((dataArray) => {
    let promises = []
    for (let index = 0; index < dataArray.length; index++) {
      promises.push(DATA_MIGRATOR_V0(dataArray[index]))
    }
    return Promise.all(promises)
  }).then((data) => console.log('done'))
function DATA_MIGRATOR_V0 (data) {
  let variants = data.variants
  let filteredObject = filterVariant(data)
  let promises = []
  for (let index = 0; index < variants.length; index++) {
    let variant = variants[index]
    let DenormedData = DeformTheData(filteredObject, variant, index)
    promises.push(AddToIndex(DenormedData))
  }
  return Promise.all(promises)
}

function AddToIndex (DenormedData) {
  return product_index.addObject(DenormedData)
}
function filterVariant (data) {
  let obj = data
  delete obj['variants']
  return obj
}
function DeformTheData (filteredObject, variant, index) {
  for (var k in variant) { filteredObject[k] = variant[k] }
  filteredObject['objectID'] = ObjectIdgenerator(filteredObject, index)
  return filteredObject
}
function ObjectIdgenerator (filteredObject, index) {
  return filteredObject['productUid'] + '_' + 'size' + '_' + filteredObject['size']
}
