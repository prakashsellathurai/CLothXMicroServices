'use strict'
const ObjectIdgenerator = require('./generate').ObjectIdforProduct

function filterVariantInProduct (data) {
  let obj = data
  delete obj['variants']
  return obj
}
function DeNormalizeTheProductData (filteredObject, variant, index) {
  for (var k in variant) { filteredObject[k] = variant[k] }
  filteredObject['objectID'] = ObjectIdgenerator(filteredObject)
  return filteredObject
}
function extractVariantInProduct (data) {
  return data.variants
}
module.exports = {
  filterVariantInProduct: filterVariantInProduct,
  DeNormalizeTheProductData: DeNormalizeTheProductData,
  extractVariantInProduct: extractVariantInProduct
}
