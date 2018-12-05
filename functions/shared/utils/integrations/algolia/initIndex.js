'use strict'
const client = require('./../../../environment/initAlgoliaClient').withCredentials()

module.exports = {
  product: client.initIndex('product_search'),
  store: client.initIndex('store_search')
}
