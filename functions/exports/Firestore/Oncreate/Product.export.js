var functions = require('firebase-functions')
const db = require('./../../../shared/firestore/CRUD/db')
module.exports = functions
  .firestore
  .document('/stores/{storeId}/products/{productId}')
  .onCreate((snap, context) => PrnAssigner(snap, context))

function PrnAssigner (snap, context) {
  let storeId = context.params.storeId
  let productId = context.params.productId
  return db.prnCheckLoop(storeId)
    .then(rand => db.SetProductPRN(storeId, productId, rand))
}
