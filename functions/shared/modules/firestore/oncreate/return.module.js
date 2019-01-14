const db = require('./../../../firestore/CRUD/index')
const _ = require('lodash')
function StockUpdater (isAllReturn, storeId, invoiceId, cartProducts) {
  return invoiceUpdater(isAllReturn, invoiceId, cartProducts)
    .then(() => db
      .return
      .productsOnLocalInventory(storeId, cartProducts))
}
function invoiceUpdater (isAllReturn, invoiceId, cartProducts) {
  if (isAllReturn) {
    return db
      .delete
      .invoice(invoiceId)
  } else {
    return db
      .update
      .invoiceOnProductsReturn(invoiceId, cartProducts)
  }
}
function isParamsValid (storeId, returnId, isAllReturn, cartProducts, invoiceId, customerNo) {
  if (_.isUndefined(storeId)) {
    console.log('storeId is undefined')
    return false
  } else if (_.isUndefined(returnId)) {
    console.log('returnId is undefined')
    return false
  }
}
/**
 * module handles the oncreate return trigger
 * @namespace OnCreateReturnModule
 * @param {string} storeId
 * @param {string} returnId
 * @param {boolean} isAllReturn
 * @param {array} cartProducts - array of objects representing products
 * @param {string} invoiceId
 * @param {number} customerNo
 * @returns {Promise} resolvedPromise
 */
module.exports = (storeId, returnId, isAllReturn, cartProducts, invoiceId, customerNo) => {
  if (isParamsValid(storeId, returnId, isAllReturn, cartProducts, invoiceId, customerNo)) {
    return StockUpdater(isAllReturn, storeId, invoiceId, cartProducts)
      .then(() => db.timestamp.OnCreateReturn(storeId, returnId))
      .then(() => db.update.returnCountInReward(customerNo, cartProducts.length))
  } else {
    return Promise.reject(new Error('invalid params'))
  }
}
