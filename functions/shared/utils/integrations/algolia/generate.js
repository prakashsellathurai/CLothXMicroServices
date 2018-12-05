'use strict'
function ObjectIdforProduct (data) {
  return data['productUid'] + '_' + 'size' + '_' + data['size']
}
module.exports = {
  ObjectIdforProduct: ObjectIdforProduct
}
