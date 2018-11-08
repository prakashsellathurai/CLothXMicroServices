//= ===================================== IMPORTS ===============================================//
var functions = require('firebase-functions')
var dbFun = require('../../../shared/firestore/CRUD/db')

// ===============================================================================================
function MainHandler(snap, context) {
    const storeId = context.params.storeId
    const invoiceId = context.params.invoiceId
    return dbFun.deletePendingBill(storeId, invoiceId)
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
                'storeId': storeId,
                'customerNo': snap.data().customerNumber,
                'customerName': snap.data().customerName,
                'createdOn': snap.data().createdOn,
                'totalPrice': snap.data().totalPrice,
                'totalQuantity': snap.data().totalQuantity,
            }
            return dbFun.updateCustomerReward(givenCustomerData)
        })
        .catch((err) => console.log(err))
}

// ==================================================================================================
// =====================================export module================================================
module.exports = functions
    .firestore
    .document('invoices/{invoiceId}')
    .onCreate((snap, context) => MainHandler(snap, context))
