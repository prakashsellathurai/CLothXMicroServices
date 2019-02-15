'use strict'
const instance = require('../../../environment/initRazorpay').withCredentials()
module.exports = {
  /**
   * creates the customer in razorpay service
   * @async
   * @param {string} name
   * @param {emailId} email
   * @param {number} contact
   * @returns {Object} Promise
   */
  customer: (name, email, contact) => instance.customers.create({ name, email, contact }),
  /**
   * creates the plan with specified object
   * @param {Object} params
   * @async
   * @returns {Object} Promise
   */
  plan: (params) => instance.plans.create(params),
  /**
   * creates Subscription
   * @param {Object} params
   * @async
   * @returns {Object} Promise
   */
  Subscription: (params) => instance.subscriptions.create(params),
  /**
   * creates addon for the given subscriptionId
   * @param {String} subscriptionId
   * @param {Object} params
   * @async
   * @returns {Object} Promise
   */
  Addon: (subscriptionId, params) => instance.subscriptions.createAddon(subscriptionId, params)
}
