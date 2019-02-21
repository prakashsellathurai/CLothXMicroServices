//= ===================================== IMPORTS ===============================================//
var functions = require('firebase-functions')
var db = require('./../../../shared/firestore/CRUD')
var sendMessage = require('./../../../shared/utils/message/SendMessage')
var utils = require('./../../../shared/utils/general_utils')

// ===============================================================================================
/**
 * generates message for sms
 * @param {URL} link
 */
function generateMessage (link) {
  return `We hope you enjoyed your shopping. We would Love to hear your feedback. Click ${link}`
}
function MainHandler (snap, context) {
  const sendSmsBoolean = snap.data().sendSms
  const invoiceId = context.params.invoiceId
  const customerNumber = snap.data().customerNumber
  const storeId = snap.data().storeUid
  const customerName = snap.data().customerName
  const totalQuantity = snap.data().totalQuantity
  const totalPrice = snap.data().totalPrice
  const createdOn = new Date()

  return db
    .update
    .customerReward(
      customerNumber,
      storeId,
      customerName,
      totalQuantity,
      totalPrice,
      createdOn)
    .then(() => utils
      .checkEnv()
      .then((bool) => (bool) ? `https://www.spoteasy.in/u/invoice/${invoiceId}` : `https://spoteasytest.firebaseapp.com/u/invoice/${invoiceId}`)
      .then((link) => generateMessage(link))
      .then((Message) => {
        if (sendSmsBoolean) {
          return sendMessage(customerNumber, Message)
            .then((body) => JSON.parse(body))
            .then((body) => {
              let messageSuccess = (body.type === 'success')
              let smsId = (messageSuccess) ? body.message : utils.generateId()
              let status = body.type
              let errorDescription = body.message
              return db.log.sms(storeId, customerNumber, smsId, status, errorDescription)
            })
        } else {
          return Promise.resolve(0)
        }
      })

      .catch((err) => console.error(err))

    )
}

// ==================================================================================================
// =====================================export module================================================
module.exports = functions
  .firestore
  .document('invoices/{invoiceId}')
  .onCreate((snap, context) => MainHandler(snap, context))
