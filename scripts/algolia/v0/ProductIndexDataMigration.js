const firebase = require('firebase-admin')

var serviceAccountSource = require('./../../../functions/shared/environment/clothxnet-firebase-adminsdk-wkk1h-a27faaab6d.json') // source DB key
const firestoreAdmin = firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccountSource)
})
const firestore = firestoreAdmin.firestore()
const productIndex = require('./../../../functions/shared/utils/integrations/algolia/initIndex').product
let productRef = firestore.collection('products')
let utils = require('./../../../functions/shared/utils/integrations/algolia/utils')
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
  data = utils.dataPreprocessor(data)
  let variants = utils.extractVariantInProduct(data)
  let filteredObject = utils.filterVariantInProduct(data)
  let promises = []
  for (let index = 0; index < variants.length; index++) {
    let variant = variants[index]
    let DenormedData = utils.DeNormalizeTheProductData(filteredObject, variant, index)
    promises.push(addProductInalgolia(DenormedData, variant))
  }
  return Promise.all(promises).then((variants) => console.log(variants))
}

function addProductInalgolia (DenormedData, variant) {
  return productIndex.addObject(DenormedData)
    .then((content) => content.objectID)
    .then((objectId) => utils.updateVariantWithObjectId(variant, objectId))
}