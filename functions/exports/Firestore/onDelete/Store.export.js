//= ===================================== IMPORTS ===============================================//
const functions = require('firebase-functions')
const algolia = require('./../../../shared/utils/integrations/algolia/index')

function DeleteIndexInAlgolia (snap) {
  const objectID = snap.id
  return index.deleteObject(objectID)
}
module.exports = functions
  .firestore
  .document('stores/{storeId}')
  .onDelete((snap, context) => DeleteIndexInAlgolia(snap))
