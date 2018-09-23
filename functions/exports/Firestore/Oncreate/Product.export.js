//= ===================================== IMPORTS ===============================================//
var functions = require('firebase-functions')
const db = require('./../../../shared/firestore/CRUD/db')
var FunctionsPatch = require('../../../shared/patches/cloudFunction/multipleFunctionInvocation')
let alreadyRunEventIds = []
function PrnAssigner (context) {
  let eventid = context.eventId
  let productId = context.params.productId
  if (FunctionsPatch.isAlreadyRunning(alreadyRunEventIds, eventid)) {
    console.error('this event is triggerred twice', eventid)
    alreadyRunEventIds = FunctionsPatch.markAsRunned(alreadyRunEventIds, eventid)
    return alreadyRunEventIds
  } else {
    FunctionsPatch.markAsRunning(alreadyRunEventIds, eventid)
    // MainThread
    return db.prnCheckLoop()
      .then(rand => db.SetProductPRN(productId, rand))
  }
}
// ==================================================================================================
// =====================================export module================================================
module.exports = functions
  .firestore
  .document('/products/{productId}')
  .onCreate((snap, context) => PrnAssigner(context))
