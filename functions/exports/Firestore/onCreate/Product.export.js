//= ===================================== IMPORTS ===============================================//
const db = require('./../../../shared/firestore/CRUD/db')
const env = require('../../../shared/environment/env')

var functions = require('firebase-functions')
var algoliasearch = require('algoliasearch')
const client = algoliasearch(env.ALGOLIA.appId, env.ALGOLIA.adminApiKey)
const index = client.initIndex('product_search')

function PrnAssigner (context) {
  let productId = context.params.productId
  return db.prnCheckLoop()
    .then(rand => db.SetProductPRN(productId, rand))
}
function IndexItInAlgolia (snap) {
  const data = snap.data()
    data.objectID = snap.id
  return index.addObject(data)
}
function MainHandler (snap, context) {
  return PrnAssigner(context)
    .then(() => IndexItInAlgolia(snap))
}
// ==================================================================================================
// =====================================export module================================================
module.exports = functions
  .firestore
  .document('/products/{productId}')
  .onCreate((snap, context) => MainHandler(snap, context))
