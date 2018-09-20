//= ===================================== IMPORTS ===============================================//
var functions = require('firebase-functions')
var dbFun = require('../../../shared/firestore/CRUD/db')
function WebsiteHandler (snap, context) {
  let storeId = context.params.storeId
  let registerUid = snap.data().registerUid
  return dbFun.AssociateStoreInfoToUser(registerUid, storeId)
}
// ==================================================================================================
// =====================================export module================================================
module.exports = functions
  .firestore
  .document('stores/{storeId}')
  .onCreate((snap, context) => WebsiteHandler(snap, context))
