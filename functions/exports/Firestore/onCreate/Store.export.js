//= ===================================== IMPORTS ===============================================//
const functions = require('firebase-functions')
const dbFun = require('../../../shared/firestore/CRUD/db')
const razorpayApi = require('./../../../shared/utils/payment/razorpay')
function OnCreateStoreHandler (snap, context) {
  let storeId = context.params.storeId
  let registerUid = snap.data().registerUid
  let contactNo = snap.data().contactNo
  let notes = snap.data().description
  let name = snap.data().usn
  let email = registerUid
  return dbFun
    .AssociateStoreInfoToUser(registerUid, storeId)
    .then(() => razorpayApi
      .CreateCustomer(name, email, contactNo, notes))
}

// ==================================================================================================
// =====================================export module================================================
module.exports = functions
  .firestore
  .document('stores/{storeId}')
  .onCreate((snap, context) => OnCreateStoreHandler(snap, context))
