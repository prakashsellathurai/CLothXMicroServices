//= ===================================== IMPORTS ===============================================//
var functions = require('firebase-functions')
var db = require('./../../../shared/firestore/CRUD/index')
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
  const customerNo = snap.data().customerNumber
  const storeId = snap.data().storeUid
  return utils
    .checkEnv()
    .then((bool) => (bool) ? `https://www.spoteasy.in/u/invoice/${invoiceId}` : `https://spoteasytest.firebaseapp.com/u/invoice/${invoiceId}`)
    .then((link) => generateMessage(link))
    .then((Message) => {
      if (sendSmsBoolean) {
        return sendMessage(customerNo, Message)
          .then((body) => JSON.parse(body))
          .then((body) => {
            let messageSuccess = (body.type === 'success')
            let smsId = (messageSuccess) ? body.message : utils.generateId()
            let status = body.type
            let errorDescription = body.message
            return db.utils.sms.log.OnInvoiceReport(storeId, smsId, customerNo, status, errorDescription)
          })
      } else {
        return Promise.resolve(0)
      }
    })

    .catch((err) => console.error(err))
}

// ==================================================================================================
// =====================================export module================================================
module.exports = functions
  .firestore
  .document('invoices/{invoiceId}')
  .onCreate((snap, context) => MainHandler(snap, context))
