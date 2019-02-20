'use strict'
const productIndex = require('./initIndex').product.unsorted

function product (data) {
  data.objectId = data.productUid
  return addProductInalgolia(data)
}

function addProductInalgolia (DenormedData) {
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
