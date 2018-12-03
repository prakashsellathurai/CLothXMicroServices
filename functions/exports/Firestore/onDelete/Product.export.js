//= ===================================== IMPORTS ===============================================//
const functions = require('firebase-functions')
const algolia = require('./../../../shared/utils/integrations/algolia/index')
const index = algolia.initIndex.productIndex

function DeleteIndexInAlgolia (snap) {
  const objectID = snap.id
  return index.deleteObject(objectID)
}
// ==================================================================================================
// =====================================export module================================================
module.exports = functions
  .firestore
  .document('/products/{productId}')
  .onDelete((snap, context) => DeleteIndexInAlgolia(snap))
