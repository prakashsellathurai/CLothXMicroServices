'use strict'
const ProductIndex = require('./initIndex').product.unsorted
const utils = require('./utils')
/**
 *
 * @param {} data
 * @deprecated
 */
function product (data) {
  // data = utils.dataPreprocessor(data)
  // let variants = utils.extractVariantInProduct(data)
  // let filteredObject = utils.filterVariantInProduct(data)
  // let promises = []
  // for (let index = 0; index < variants.length; index++) {
  //   let variant = variants[index]
  //   let DenormedData = utils.DeNormalizeTheProductData(filteredObject, variant)
  //   promises.push(DenormedData)
  // }
  data = utils.addObjectIdToData(data)
  return ProductIndex.partialUpdateObject(data)
    .then(content => console.log(content))
}

function productsWithSamePRN (data) {

}
module.exports = {
  product: product,
  productsWithSamePRN: productsWithSamePRN
}
