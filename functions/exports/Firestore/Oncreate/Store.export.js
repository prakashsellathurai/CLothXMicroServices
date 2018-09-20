//= ===================================== IMPORTS ===============================================//
var functions = require('firebase-functions')
var dbFun = require('../../../shared/firestore/CRUD/db')
var sendEmail = require('../../../shared/utils/Mail/sendmail')
var sendMessage = require('../../../shared/utils/message/SendMessage')
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
