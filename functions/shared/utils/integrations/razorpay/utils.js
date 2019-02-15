'use strict'
const instance = require('../../../environment/initRazorpay').withCredentials()
module.exports = {
  /**
 * tells whether the authTrabsaction is valid or not
 * @param {String} RazorPayPaymentId
 * @param {String} razorPaySubscriptionId
 * @param {sha256} razorPaySignature
 * @returns {Boolean}
 */
  verifyAuthTransaction: (RazorPayPaymentId, razorPaySubscriptionId, razorPaySignature) => {
    const crypto = require('crypto')
    const secret = `${RazorPayPaymentId}|${razorPaySubscriptionId}`
    const hmac = crypto.createHmac('sha256', secret)
    const expectedSignature = hmac.digest('hex')
    return expectedSignature === razorPaySignature
  },
  /**
 * refund the provided @paymentId
 * @param {String} paymentId
 * @param {number} amount
 * @param {Object}
 * @async
 * @returns {Object} Promise
 */
  refund: (paymentId, amount, notes) => instance.payments.refund(paymentId, { amount, notes })
}
