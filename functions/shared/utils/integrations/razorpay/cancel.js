'use strict'
const instance = require('../../../environment/initRazorpay').withCredentials()
module.exports = {
  /**
 * cancel the subscription
 * @param {String} subscriptionId
 * @param {Boolean} cancelAtCycleEnd
 * @async
 * @returns {Object} Promise
 */
  Subscription: (subscriptionId, cancelAtCycleEnd) => instance.subscriptions.cancel(subscriptionId, cancelAtCycleEnd)

}
