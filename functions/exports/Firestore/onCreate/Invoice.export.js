//= ===================================== IMPORTS ===============================================//
var functions = require('firebase-functions')
var db = require('../../../shared/firestore/CRUD/index')
var sendMessage = require('./../../../shared/utils/message/SendMessage')
var utils = require('./../../../shared/utils/general_utils')

function MainHandler (snap, context) {
  const cartProducts = snap.data().cartProducts
  const sendSmsBoolean = snap.data().sendSms
  const cartProducts = snap.data().cartProducts
  const invoiceId = context.params.invoiceId
  const customerNo = snap.data().customerNumber
  const storeId = snap.data().storeUid
  return db
    .reduce
    .productsOnLocalInventory(cartProducts)
    .then(() => db
      .set
      .invoicePendingStatusToFalse(invoiceId))

    .then(() => {
      const givenCustomerData = {
        'storeId': snap.data().storeUid,
        'customerNo': snap.data().customerNumber,
        'customerName': snap.data().customerName,
        'createdOn': snap.data().createdOn,
        'totalPrice': snap.data().totalPrice,
        'totalQuantity': snap.data().totalQuantity
      }
      return db
        .update
        .customerReward(givenCustomerData)
    })
         .catch((err) => {
      if (err) {
        return dbFun.SetInvoicePendingStatusToFalse(invoiceId)
      } else {
        console.error(err)
      }
    })

}

// ==================================================================================================
// =====================================export module================================================
module.exports = functions
  .firestore
  .document('invoices/{invoiceId}')
  .onCreate((snap, context) => MainHandler(snap, context))
