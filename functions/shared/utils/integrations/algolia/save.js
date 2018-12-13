'use strict'
const productIndex = require('./initIndex').product.unsorted
const utils = require('./utils')
function product (data) {
  data = utils.dataPreprocessor(data)
  let variants = utils.extractVariantInProduct(data)
  let filteredObject = utils.filterVariantInProduct(data)
  let promises = []
  for (let index = 0; index < variants.length; index++) {
    let DenormedData = utils.DeNormalizeTheProductData(filteredObject, variants[index])
    promises.push(DenormedData)
  }
  return productIndex.saveObjects(promises)
    .then(content => console.log(content))
}
module.exports = {
  product: product
}
