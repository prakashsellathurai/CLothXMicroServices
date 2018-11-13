const db = require('./index')
const firestore = db.firestore
const admin = db.admin
const createObject = {
  createdOn: admin.firestore.FieldValue.serverTimestamp()
}
const updateObject = {
  updatedOn: admin.firestore.FieldValue.serverTimestamp()
}
function OnCreateReturn (storeId, returnId) {
  return firestore
    .doc(`stores/${storeId}/returns/${returnId}`)
    .update(createObject)
}

function OnUpdatedPendingBill (storeId, pendingBillId) {
  return firestore
    .doc(`stores/${storeId}/pendingbills/${pendingBillId}`)
    .update(updateObject)
}
module.exports = {
  OnCreateReturn: OnCreateReturn,
  OnUpdatedPendingBill: OnUpdatedPendingBill
}
