'use strict'
const express = require('express')
const subscriptionRouter = express.Router()
const razorpayApi = require('./../razorpay')
const db = require('./../../../firestore/CRUD/db')
subscriptionRouter.post('/verify', (req, res) => {
  let storeId = req.query.store_id
  let razorpayPaymentId = req.body.razorpay_payment_id
  let razorpaySubscriptionId = req.body.razorpay_subscription_id
  let razorpaySignature = req.body.razorpay_signature
  if (razorpayPaymentId == null) {
    res.json({error: 'unauthorized', error_description: 'razorpay_payment_id is required'})
  } else if (razorpaySubscriptionId == null) {
    res.json({error: 'unauthorized', error_description: 'razorpay_subscription_id is required'})
  } else if (razorpaySignature == null) {
    res.json({error: 'unauthorized', error_description: 'razorpay_signature is required'})
  } else if (storeId == null) {
    res.json({error: 'unauthorized', error_description: 'store_id is required'})
  } else if (razorpayApi
    .verifyAuthTransaction(razorpayPaymentId, razorpaySubscriptionId, razorpaySignature)) {
    return db
      .logPaymentAuthVerification(storeId, razorpaySubscriptionId, razorpaySignature)
      .then((docRef) => {
        let docId = docRef.id
        res.json({doc_id: docId})
      })
  } else {
    res.json({error: 'unauthorized', error_description: 'credentials not valid'})
  }
})
subscriptionRouter.post('/create', (req, res) => {
  let params = req.body
  return razorpayApi
    .CreateSubscription(params)
    .then((response) => res
      .json(JSON
        .parse(response)))
})
module.exports = subscriptionRouter
