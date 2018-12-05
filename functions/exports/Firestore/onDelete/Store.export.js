//= ===================================== IMPORTS ===============================================//
const functions = require('firebase-functions')
const algoliaIndex = require('./../../../shared/utils/integrations/algolia/index').initIndex.store

function DeleteIndexInAlgolia (snap) {
  const objectID = snap.id
  return algoliaIndex.deleteObject(objectID)
}
module.exports = functions
  .firestore
  .document('stores/{storeId}')
  .onDelete((snap, context) => DeleteIndexInAlgolia(snap))
