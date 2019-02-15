'use strict'
const instance = require('../../../environment/initRazorpay').withCredentials()
module.exports = {
/**
 * update the customer info
 * @param {String} customerId
 * @param {String} name
 * @param {String} email
 * @param {number} contact
 * @async
 * @returns {Object} Promise
 */
  customer: (customerId, name, email, contact) => instance.customers.edit(customerId, { name, email, contact })
}
