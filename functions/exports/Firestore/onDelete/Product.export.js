//= ===================================== IMPORTS ===============================================//
const functions = require('firebase-functions')
const algolia = require('./../../../shared/utils/integrations/algolia/index')

function DeleteIndexInAlgolia (data) {
  return algolia.delete.product(data)
}
// ==================================================================================================
// =====================================export module================================================
module.exports = functions
  .firestore
  .document('/products/{productId}')
  .onDelete((snap, context) => DeleteIndexInAlgolia(snap.data()))
