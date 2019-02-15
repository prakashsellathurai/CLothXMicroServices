'use strict'
const functions = require('firebase-functions')
const razorpayApi = require('./../../../shared/utils/integrations/razorpay')
module.exports = functions
  .firestore
  .document('users/{userId}')
  .onUpdate((change, context) => {
    const document = change.after.data()
    let razorpayCustomerId = document.razorPayPaymentId
    let email = document.email
    let name = document.displayName
    let contactNo = document.phoneNumber
    return razorpayApi.edit.customer(razorpayCustomerId, name, email, contactNo)
  })
