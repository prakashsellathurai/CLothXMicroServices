//= ===================================== IMPORTS ===============================================//
const db = require('./../../../shared/firestore/CRUD/index')
const functions = require('firebase-functions')
const algolia = require('./../../../shared/utils/integrations/algolia/index')

function PrnAssigner (context) {
  let productId = context.params.productId
  return db.set.RandomObjectIdToProduct(productId)
}

function IndexItInAlgolia (data) {
  return algolia.save.product(data)
}

function MainHandler (snap, context) {
  return PrnAssigner(context)
    .then((data) => IndexItInAlgolia(data))
}

// ==================================================================================================
// =====================================export module================================================
module.exports = functions
  .firestore
  .document('/products/{productId}')
  .onCreate((snap, context) => MainHandler(snap, context))
