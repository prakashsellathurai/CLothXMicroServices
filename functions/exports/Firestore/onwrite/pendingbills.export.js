//= ===================================== IMPORTS ===============================================//
var functions = require('firebase-functions')
// ==================================================================================================
// =====================================export module================================================
module.exports = functions
  .firestore
  .document('stores/{storeId}/pendingbills/{pendingBillId}')
  .onWrite((change, context) => {
    const document = change.after.exists ? change.after.data() : null
    const oldDocument = change.before.data()
    
  })
