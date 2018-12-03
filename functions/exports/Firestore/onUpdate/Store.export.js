const functions = require('firebase-functions')
const razorpayApi = require('../../../shared/utils/payment/razorpay')
const db = require('./../../../shared/firestore/CRUD/index')
const algolia = require('./../../../shared/utils/integrations/algolia/index')
const storeIndex = algolia.initIndex.storeIndex

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
    const dataForalgolia = document
    dataForalgolia.objectID = context.params.storeId
    return storeIndex
      .saveObject(dataForalgolia)
      .then(() => {
        if (CheckForPaymentInfoChanges(document, oldDocument)) {
          let registerUid = document.registerUid // need to configure for changes
          let contactNo = document.contactNo
          let notes = document.description
          let name = document.storeName
          let customerId = document.razorPayPaymentId
          try {
            return db
              .get
              .UserEmailByUUID(registerUid)
              .then((email) => razorpayApi
                .EditCustomer(customerId, name, email, contactNo, notes))
              .then(() => {

              })
          } catch (error) {
            console.log(error)
            return Promise.resolve(error)
          }
        } else {
          return Promise.resolve(0)
        }
      })
  })
