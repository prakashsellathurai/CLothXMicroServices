const db = require('./../../CRUD/index')
const firestore = db.firestore
const admin = db.admin

function OnInvoiceReport (storeId, smsId, customerNo, status, errorDescription) {
  return firestore
    .collection(`stores/${storeId}/sms`)
    .doc(smsId)
    .set({
      smsId: smsId,
      storeId: storeId,
      purpose: 'invoice',
      to: customerNo,
      status: status,
      errorDescription: errorDescription,
      createdOn: admin.firestore.FieldValue.serverTimestamp()
    })
}
module.exports = {
  OnInvoiceReport: OnInvoiceReport
}
