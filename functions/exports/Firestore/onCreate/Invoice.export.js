//= ===================================== IMPORTS ===============================================//
var functions = require('firebase-functions')
var dbFun = require('../../../shared/firestore/CRUD/index')
var sendMessage = require('./../../../shared/utils/message/SendMessage')
var utils = require('./../../../shared/utils/general_utils')

// ===============================================================================================
function MainHandler (snap, context) {
  const sendSmsBoolean = snap.data().sendSms
  const cartProducts = snap.data().cartProducts
  const invoiceId = context.params.invoiceId
  const customerNo = snap.data().customerNumber
  const storeId = snap.data().storeUid

  return dbFun.LocalInventoryProductReducer(storeId, cartProducts)
    .then(() => dbFun.SetInvoicePendingStatusToFalse(invoiceId))
    .catch((err) => {
      if (err) {
        return dbFun.SetInvoicePendingStatusToFalse(invoiceId)
      } else {
        console.error(err)
      }
    })
    .then(() => {
      const givenCustomerData = {
        'storeId': snap.data().storeUid,
        'customerNo': snap.data().customerNumber,
        'customerName': snap.data().customerName,
        'createdOn': snap.data().createdOn,
        'totalPrice': snap.data().totalPrice,
        'totalQuantity': snap.data().totalQuantity
      }
      return dbFun.updateCustomerReward(givenCustomerData)
    }).then(() => {
      let Message = ` your invoice id : ${invoiceId} to read your invoice click here >>> https://www.spoteasy.in/u/invoice/${invoiceId} `
      if (sendSmsBoolean) {
        return sendMessage(customerNo, Message)
          .then((body) => JSON.parse(body))
          .then((body) => {
            let messageSuccess = (body.type === 'success')
            let smsId = (messageSuccess) ? body.message : utils.generateId()
            let status = body.type
            let errorDescription = (messageSuccess) ? 'no error ' : body.message
            return dbFun.LogsmsOnInvoiceReport(storeId, smsId, customerNo, status, errorDescription)
          })
      } else {
        return Promise.resolve(0)
      }
    })

    .catch((err) => console.log(err))
}

// ==================================================================================================
// =====================================export module================================================
module.exports = functions
  .firestore
  .document('invoices/{invoiceId}')
  .onCreate((snap, context) => MainHandler(snap, context))
