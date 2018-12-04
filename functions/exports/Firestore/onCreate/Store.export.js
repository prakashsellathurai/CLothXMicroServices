//= ===================================== IMPORTS ===============================================//
const functions = require('firebase-functions')
const algolia = require('./../../../shared/utils/integrations/algolia/index')
const storeIndex = algolia.initIndex.store
const db = require('../../../shared/firestore/CRUD/index')

function OnCreateStoreHandler (snap, context) {
  let storeId = context.params.storeId
  let registerUid = snap.data().registerUid
  return db
    .associate
    .storeInfoToUser(registerUid, storeId)
    .then(() => {
      const data = snap.data()
      data.objectID = snap.id
      return storeIndex.addObject(data)
    })
}

// ==================================================================================================
// =====================================export module================================================
module.exports = functions
  .firestore
  .document('stores/{storeId}')
  .onCreate((snap, context) => OnCreateStoreHandler(snap, context))
