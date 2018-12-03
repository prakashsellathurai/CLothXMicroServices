'use strict'
const functions = require('firebase-functions')
const algolia = require('./../../../shared/utils/integrations/algolia/index')
const index = algolia.initIndex.productIndex

function UpdateIndexInAlgolia (doc) {
  doc.objectID = doc.productUid
  return index.saveObject(doc)
}

module.exports = functions
  .firestore
  .document('products/{productId}')
  .onUpdate((change, context) => UpdateIndexInAlgolia(change.after.data()))
