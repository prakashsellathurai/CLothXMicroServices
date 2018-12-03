//= ===================================== IMPORTS ===============================================//
var functions = require('firebase-functions')
var db = require('./../../../shared/firestore/CRUD/index')
var sendMessage = require('./../../../shared/utils/message/SendMessage')
var utils = require('./../../../shared/utils/general_utils')

// ===============================================================================================
function MainHandler(snap, context) {
    const cartProducts = snap.data().cartProducts
    const sendSmsBoolean = snap.data().sendSms
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
        }).then(() => {
            let Message = `We hope you enjoyed your shopping.
                           We would Love to hear your feedback.
                           Click https://www.spoteasy.in/u/invoice/${invoiceId}`
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
        .catch((err) => {
            if (err) {
                return db.set.invoicePendingStatusToFalse(invoiceId)
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
