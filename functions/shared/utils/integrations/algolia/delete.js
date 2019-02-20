'use strict'
const productIndex = require('./initIndex').product.unsorted
// const utils = require('./utils')

// function product (data) {
//   let variants = utils.extractVariantInProduct(data)
//   let filteredObject = utils.filterVariantInProduct(data)
//   let promises = []
//   for (let index = 0; index < variants.length; index++) {
//     let variant = variants[index]
//     let DenormedData = utils.DeNormalizeTheProductData(filteredObject, variant, index)
//     promises.push(productIndex.deleteObject(DenormedData.objectID))
//   }
//   return Promise.all(promises)
// }

function product (data) {
  return productIndex.deleteObject(data.productUid)
}
module.exports = {
  product: product
}
