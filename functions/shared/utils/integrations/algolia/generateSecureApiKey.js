const env = require('./../../../environment/env')
var algoliasearch = require('algoliasearch')
const Admin = algoliasearch(env.ALGOLIA.appId, env.ALGOLIA.adminApiKey)
function generateSecuredApiKey () {
  var params = {
    hitsPerPage: 20,
    filters: 'islista',
    validUntil: Date.now() + 3600,
    restrictIndices: 'index1,index2',
    userToken: ''
  }
  return Admin.generateSecuredApiKey(env.ALGOLIA.SEARCH_ONLY_API_KEY, params)
}
