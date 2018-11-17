const db = require('./index')
const firestore = db.firestore
const admin = db.admin
function OnCreateReturn (storeId, returnId) {
  return firestore
    .doc(`stores/${storeId}/returns/${returnId}`)
    .update({
      createdOn: admin.firestore.FieldValue.serverTimestamp()
    })
}

function OnUpdatedPendingBill (storeId, pendingBillId) {
  return firestore
    .doc(`stores/${storeId}/pendingbills/${pendingBillId}`)
    .update({
      updatedOn: admin.firestore.FieldValue.serverTimestamp()
    })
}
module.exports = {
  OnCreateReturn: OnCreateReturn,
  OnUpdatedPendingBill: OnUpdatedPendingBill
}
