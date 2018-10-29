//= ===================================== IMPORTS ===============================================//
var functions = require('firebase-functions')
const db = require('../../../shared/firestore/CRUD/db')
// ==================================================================================================
// =====================================export module================================================
module.exports = functions
  .firestore
  .document('stores/{storeId}/pendingbills/{pendingBillId}')
  .onCreate((snap, context) => {
    let storeId = context.params.storeId
    let pendingBillId = context.params.pendingBillId
    return db.assignRandomPendingBillToken(storeId, pendingBillId)
  }
  )
