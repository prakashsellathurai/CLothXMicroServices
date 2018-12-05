const env = require('../../../../shared/environment/env')
var algoliasearch = require('algoliasearch')
const client = algoliasearch(env.ALGOLIA.appId, env.ALGOLIA.adminApiKey)

module.exports = {
  product: client.initIndex('product_search'),
  store: client.initIndex('store_search')
}
