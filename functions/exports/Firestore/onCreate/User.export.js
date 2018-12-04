
'use strict'
const functions = require('firebase-functions')
const razorpayApi = require('./../../../shared/utils/payment/razorpay')
const db = require('./../../../shared/firestore/CRUD/index')
const createRazorpayCustomer = (name, email, contactNo) => razorpayApi.CreateCustomer(name, email, contactNo)
const saveTodb = (razorPayId, email) => db.utils.razorpay.save.id(email, razorPayId)

function mainHandler (snap) {
  let email = snap.data().email
  let name = snap.data().displayName
  let contactNo = snap.data().phoneNumber
  return createRazorpayCustomer(name, email, contactNo)
    .then((res) => saveTodb(res.id, email))
}
module.exports = functions
  .firestore
  .document('users/{userId}')
  .onCreate((snap, context) => mainHandler(snap))
