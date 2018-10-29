const functions = require('firebase-functions')
const razorpayApi = require('../../../shared/utils/payment/razorpay')
const db = require('./../../../shared/firestore/CRUD/db')
function CheckForPaymentInfoChanges (document, oldDocument) {
  return document.registerUid !== oldDocument.registerUid ||
document.contactNo !== oldDocument.contactNo ||
document.description !== oldDocument.description ||
document.storeName !== oldDocument.storeName
}
module.exports = functions
  .firestore
  .document('stores/{storeId}')
  .onUpdate((change, context) => {
    const document = change.after.data()
    const oldDocument = change.before.data()

    if (CheckForPaymentInfoChanges(document, oldDocument)) {
      let registerUid = document.registerUid // need to configure for changes
      let contactNo = document.contactNo
      let notes = document.description
      let name = document.storeName
      let customerId = document.razorPayPaymentId
      try {
        return db
          .GetUserEmailByUUID(registerUid)
          .then((email) => razorpayApi
            .EditCustomer(customerId, name, email, contactNo, notes))
      } catch (error) {
        console.log(error)
        return Promise.resolve(error)
      }
    } else {
      return Promise.resolve(0)
    }
  })