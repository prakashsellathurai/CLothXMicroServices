//= ===================================== IMPORTS ===============================================//
const db = require('./../../../shared/firestore/CRUD/index')
const env = require('../../../shared/environment/env')

var functions = require('firebase-functions')
var algoliasearch = require('algoliasearch')
const client = algoliasearch(env.ALGOLIA.appId, env.ALGOLIA.adminApiKey)
const index = client.initIndex('product_search')

function PrnAssigner (context) {
  let productId = context.params.productId
  return db
    .utils
    .prnCheckLoop()
    .then(prn => {
      return db
        .set
        .productPRN(productId, prn)
        .then(() => Promise.resolve(prn))
    })
}

function IndexItInAlgolia (snap, prn) {
  const data = snap.data()
  data.objectID = snap.id
  data.prn = prn
  return index.addObject(data)
}

function MainHandler (snap, context) {
  return PrnAssigner(context)
    .then((prn) => IndexItInAlgolia(snap, prn))
}

// ==================================================================================================
// =====================================export module================================================
module.exports = functions
  .firestore
  .document('/products/{productId}')
  .onCreate((snap, context) => MainHandler(snap, context))
