//= ===================================== IMPORTS ===============================================//
const db = require('./../../../shared/firestore/CRUD/index')
const functions = require('firebase-functions')
const algolia = require('./../../../shared/utils/integrations/algolia/index')

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

function IndexItInAlgolia (snap) {
  return algolia.save.product(snap.data())
    .then((variants) => db.set.objectIDtoProduct(snap.id, variants))
}

function MainHandler (snap, context) {
  return PrnAssigner(context)
    .then((prn) => IndexItInAlgolia(snap))
}

// ==================================================================================================
// =====================================export module================================================
module.exports = functions
  .firestore
  .document('/products/{productId}')
  .onCreate((snap, context) => MainHandler(snap, context))
