const db = require('./db')
const firestore = db.firestore
const admin = db.admin
const createTimestamp = {
  createdOn: admin.firestore.FieldValue.serverTimestamp
}
const updateTimestamp = {
  updatedOn: admin.firestore.FieldValue.serverTimestamp
}
const OnCreateReturn = (storeId, returnId) => firestore.doc(`stores/${storeId}/returns/${returnId}`).update(createTimestamp)
const OnUpdatedPendingBill = (storeId, pendingBillId) => firestore.doc(`stores/${storeId}/pendingbills/${pendingBillId}`).update(updateTimestamp)
module.exports = {
  OnCreateReturn: OnCreateReturn,
  OnUpdatedPendingBill: OnUpdatedPendingBill
}
