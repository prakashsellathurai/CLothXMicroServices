const env = require('./../../../functions/shared/environment/env')
var algoliasearch = require('algoliasearch')
const Admin = algoliasearch(env.ALGOLIA.appId, env.ALGOLIA.adminApiKey)
const index = Admin.initIndex('product_search')

index
  .search({
    query: 'w2DUjxHxBIQCuYg4LB0ZlALpD7r2'
  }).then((val) => {
    let filter = val.hits.reduce(e => { if (e.data.isListable) return e.data })
    console.log(filter.length)
  })
