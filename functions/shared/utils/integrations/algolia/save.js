'use strict'
const productIndex = require('./initIndex').product.unsorted
const utils = require('./utils')
function product (data) {
  data = utils.dataPreprocessor(data)
  let variants = utils.extractVariantInProduct(data)
  let filteredObject = utils.filterVariantInProduct(data)
  let promises = []
  for (let index = 0; index < variants.length; index++) {
    let variant = variants[index]
    let DenormedData = utils.DeNormalizeTheProductData(filteredObject, variant)
    promises.push(addProductInalgolia(DenormedData, variant))
  }
  return Promise.all(promises)
}
function addProductInalgolia (DenormedData, variant) {
  return productIndex.saveObject(DenormedData)
}
module.exports = {
  product: product
}
