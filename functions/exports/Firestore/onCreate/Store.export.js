//= ===================================== IMPORTS ===============================================//
const functions = require('firebase-functions')
const db = require('../../../shared/firestore/CRUD/index')
const razorpayApi = require('./../../../shared/utils/payment/razorpay')
const algolia = require('./../../../shared/utils/integrations/algolia/index')
const storeIndex = algolia.initIndex.storeIndex

function OnCreateStoreHandler (snap, context) {
  let storeId = context.params.storeId
  let registerUid = snap.data().registerUid
  let contactNo = snap.data().contactNo
  let notes = snap.data().description
  let name = snap.data().usn
  return db
    .associate
    .storeInfoToUser(registerUid, storeId)
    .then((email) =>
      razorpayApi
        .CreateCustomer(name, email, contactNo, notes))
    .then((res) => {
      let razorPayId = res.id
      return db
        .utils
        .razorpay
        .save
        .id(storeId, razorPayId)
    }).then(() => {
      const data = snap.data()
      data.objectID = snap.id
      return storeIndex.addObject(data)
    })
}

// ==================================================================================================
// =====================================export module================================================
module.exports = functions
  .firestore
  .document('stores/{storeId}')
  .onCreate((snap, context) => OnCreateStoreHandler(snap, context))
