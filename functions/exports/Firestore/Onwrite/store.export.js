const functions = require('firebase-functions')
const razorpayApi = require('./../../../shared/utils/payment/razorpay')
module.exports = functions
  .firestore
  .document('stores/{storeId}')
  .onWrite((change, context) => {
    const document = change.after.exists ? change.after.data() : null
    let registerUid = document.registerUid
    let contactNo = document.contactNo
    let notes = document.description
    let name = document.usn
    let email = registerUid
    try {
      return razorpayApi.EditCustomer(name, email, contactNo, notes)
    } catch (error) {
      return Promise.resolve(error)
    }
  })
