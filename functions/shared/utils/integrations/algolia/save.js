'use strict'
const productIndex = require('./initIndex').product
const ObjectIdgenerator = require('./generate').ObjectIdforProduct
function product (data) {
  let variants = data.variants
  let filteredObject = filterVariant(data)
  let promises = []
  for (let index = 0; index < variants.length; index++) {
    let variant = variants[index]
    let DenormedData = DeNormTheData(filteredObject, variant, index)
    promises.push(AddToProductIndex(DenormedData))
  }
  return Promise.all(promises)
}
function AddToProductIndex (DenormedData) {
  return productIndex.addObject(DenormedData)
}
function filterVariant (data) {
  let obj = data
  delete obj['variants']
  return obj
}
function DeNormTheData (filteredObject, variant, index) {
  for (var k in variant) { filteredObject[k] = variant[k] }
  filteredObject['objectID'] = ObjectIdgenerator(filteredObject)
  return filteredObject
}
module.exports = {
  product: product
}
