'use strict'
const utils = require('./utils')
const ProductIndex = require('./initIndex').product.unsorted
function product (data) {
  let variants = utils.extractVariantInProduct(data)
  let filteredObject = utils.filterVariantInProduct(data)
  let promises = []
  for (let index = 0; index < variants.length; index++) {
    let variant = variants[index]
    let DenormedData = utils.DeNormalizeTheProductData(filteredObject, variant)
    promises.push(updateProductInalgolia(DenormedData))
  }
  return Promise.all(promises)
}
function updateProductInalgolia (DenormedData) {
  return ProductIndex.saveObject(DenormedData)
}
function productsWithSamePRN (data) {

}
module.exports = {
  product: product,
  productsWithSamePRN: productsWithSamePRN
}
