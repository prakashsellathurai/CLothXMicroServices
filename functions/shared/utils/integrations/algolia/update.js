'use strict'
const saveProduct = require('./save').product
function product (data) {
  return saveProduct(data)
}
module.exports = {
  product: product
}
