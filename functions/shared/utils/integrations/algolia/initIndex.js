const env = require('../../../../shared/environment/env')
var algoliasearch = require('algoliasearch')
const client = algoliasearch(env.ALGOLIA.appId, env.ALGOLIA.adminApiKey)

module.exports = {
  productIndex: client.initIndex('product_search'),
  storeIndex: client.initIndex('store_search')
}
