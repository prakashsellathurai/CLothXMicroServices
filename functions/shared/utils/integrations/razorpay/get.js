'use strict'
const instance = require('../../../environment/initRazorpay').withCredentials()
module.exports = {
  /**
     * gets the payment info via paymentId
     * @param {string} paymentId
     * @async
     * @returns {Object} Promise
     */
  paymentInfo: (paymentId) => instance.payments.fetch(paymentId),
  /**
     * gets the payment within the given dates
     * @param {Date} FromDate
     * @param {Date} ToDate
     * @async
     * @returns {Object} Promise
     */
  paymentsWithin: (FromDate, ToDate) => instance.payments.all({ from: FromDate, to: ToDate }),
  /**
     * gets the customer details
     * @param {String} customerId
     * @async
     * @returns {Object} Promise
     */
  customerDetails: (customerId) => instance.customers.fetch(customerId),
  /**
     * gets all subscribtion with provided object
     * @param {Object} params
     * @async
     * @returns {Object} Promise
     */
  allSubscriptions: (params) => instance.subscriptions.all(params),
  /**
     * gets the bank transfer info provided @paymentId
     * @param {String} paymentId
     * @async
     * @returns {Object} Promise
     */
  bankTransferInfo: (paymentId) => instance.payments.bankTransfer(paymentId)
}
