'use strict'
const client = require('./../../../environment/initAlgoliaClient').withCredentials()

module.exports = {
  product: {
    unsorted: client.initIndex('product_search'),
    sorted: {
      by: {
        price: {
          asc: client.initIndex('product_price_asc'),
          desc: client.initIndex('product_price_desc')
        },
        newest: client.initIndex('product_newest')
      }
    } },
  store: {
    unsorted: client.initIndex('store_search')
  }
}
