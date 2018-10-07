//= ===================================== IMPORTS ===============================================//
const env = require('../../../shared/environment/env');

var functions = require('firebase-functions')
// var algoliasearch = require('algoliasearch')
// const client = algoliasearch(env.ALGOLIA.appId, env.ALGOLIA.adminApiKey)
// const index = client.initIndex('product_search')


function DeleteIndexInAlgolia (snap) {
  console.log('data will be deleted in algolia')
  return 0
}
// ==================================================================================================
// =====================================export module================================================
module.exports = functions
    .firestore
    .document('/products/{productId}')
    .onDelete((snap, context) => DeleteIndexInAlgolia(snap))
