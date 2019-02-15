'use strict'
const instance = require('../../../environment/initRazorpay').withCredentials()
module.exports = {
  /**
     * fetches the subscription via provided @subscriptionId
     * @param {String} subscriptionId
     * @async
     * @returns {Object} Promise
     */
  subscription: (subscriptionId) => instance.subscriptions.fetch(subscriptionId),
  /**
       * fetches the plan via @planid
       * @param {String} planid
       * @async
       * @returns {Object} Promise
       */
  fetchplan: (planId) => instance.plans.fetch(planId),
  /**
       * fetches all plans
       * @param {Object} params
       * @async
       * @returns {Object} Promise
       */
  fetchAllPlan: (params) => instance.plans.all(params)
}
