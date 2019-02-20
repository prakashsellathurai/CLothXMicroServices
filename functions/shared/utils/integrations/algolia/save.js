'use strict'
const productIndex = require('./initIndex').product.unsorted

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
  if (typeof DenormedData.objectID === 'undefined') {
    console.log(DenormedData)
    console.log('undefined objectId')
    return Promise.resolve()
  } else {
    return productIndex.saveObject(DenormedData)
      .then(content => console.log(content.objectID))
  }
}
module.exports = {
  product: product
}
