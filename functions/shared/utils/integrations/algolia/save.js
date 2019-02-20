'use strict'
const productIndex = require('./initIndex').product.unsorted
const utils = require('./utils')
function product (data) {
  data = utils.addObjectIdToData(data)
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
