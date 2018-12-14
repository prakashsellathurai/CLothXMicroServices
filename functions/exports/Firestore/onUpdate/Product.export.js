'use strict'
const functions = require('firebase-functions')
const algolia = require('./../../../shared/utils/integrations/algolia/index')

function UpdateIndexInAlgolia (doc) {
  return algolia.save.product(doc)
}

module.exports = functions
  .firestore
  .document('products/{productId}')
  .onUpdate((change, context) => UpdateIndexInAlgolia(change.after.data()))
