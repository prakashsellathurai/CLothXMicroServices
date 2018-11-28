//= ===================================== IMPORTS ===============================================//
var functions = require('firebase-functions')
var db = require('../../../shared/firestore/CRUD/index')

// ===============================================================================================
function MainHandler (snap, context) {
  const cartProducts = snap.data().cartProducts
  const invoiceId = context.params.invoiceId
  return db
    .reduce
    .productsOnLocalInventory(cartProducts)
    .then(() => db
      .set
      .invoicePendingStatusToFalse(invoiceId))
    .catch((err) => {
      if (err) {
        return db
          .set
          .invoicePendingStatusToFalse(invoiceId)
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
      return db
        .update
        .customerReward(givenCustomerData)
    })
    .catch((err) => console.log(err))
}

// ==================================================================================================
// =====================================export module================================================
module.exports = functions
  .firestore
  .document('invoices/{invoiceId}')
  .onCreate((snap, context) => MainHandler(snap, context))
