//= ===================================== IMPORTS ===============================================//
var functions = require('firebase-functions')
var dbFun = require('../../../shared/firestore/CRUD/db')
var FunctionsPatch = require('../../../shared/patches/cloudFunction/multipleFunctionInvocation')
let alreadyRunEventIds = []

function OnCreateStoreHandler (snap, context) {
  let storeId = context.params.storeId
  let registerUid = snap.data().registerUid
  let eventid = context.eventId
  if (FunctionsPatch.isAlreadyRunning(alreadyRunEventIds, eventid)) {
    console.error('this event is triggerred twice', eventid)
    alreadyRunEventIds = FunctionsPatch.markAsRunned(alreadyRunEventIds, eventid)
    return alreadyRunEventIds
  } else {
    FunctionsPatch.markAsRunning(alreadyRunEventIds, eventid)
    // MainThread
    return dbFun.AssociateStoreInfoToUser(registerUid, storeId)
  }
}
// ==================================================================================================
// =====================================export module================================================
module.exports = functions
  .firestore
  .document('stores/{storeId}')
  .onCreate((snap, context) => OnCreateStoreHandler(snap, context))
