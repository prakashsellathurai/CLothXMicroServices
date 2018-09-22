//= ===================================== IMPORTS ===============================================//
var functions = require('firebase-functions')
const db = require('./../../../shared/firestore/CRUD/db')
function PrnAssigner (context) {
  let productId = context.params.productId
  return db.prnCheckLoop()
    .then(rand => db.SetProductPRN(productId, rand))
}
// ==================================================================================================
// =====================================export module================================================
module.exports = functions
  .firestore
  .document('/products/{productId}')
  .onCreate((snap, context) => PrnAssigner(context))
