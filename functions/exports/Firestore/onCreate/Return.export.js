//= ===================================== IMPORTS ===============================================//
const functions = require('firebase-functions')
const oncreatereturnModule = require('./../../../shared/modules/firestore/oncreate/return.module')
// ==================================================================================================
// =====================================export module================================================
/**
 * firestore oncreate trigger which intiates on return products
 */
module.exports = functions
  .firestore
  .document('stores/{storeId}/returns/{returnId}')
  .onCreate((snap, context) => {
    let storeId = context.params.storeId
    let returnId = context.params.returnId
    let isAllReturn = snap.data().isAllReturn
    let cartProducts = snap.data().cartProducts
    let invoiceId = snap.data().invoiceId
    let customerNo = snap.data().customerNumber
    return oncreatereturnModule(storeId, returnId, isAllReturn, cartProducts, invoiceId, customerNo)
  })
