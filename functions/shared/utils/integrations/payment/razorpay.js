
var instance = require('./../../../environment/initRazorpay').withCredentials()
const create = {
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
 */
  plan: (params) => instance.plans.create(params),
  /**
 * creates Subscription
 * @param {Object} params
 */
  Subscription: (params) => instance.subscriptions.create(params),
  /**
 * creates addon for the given subscriptionId
 * @param {String} subscriptionId
 * @param {Object} params
 */
  Addon: (subscriptionId, params) => instance.subscriptions.createAddon(subscriptionId, params)
}
const _get = {
/**
 * gets the payment info via paymentId
 * @param {string} paymentId
 */
  paymentInfo: (paymentId) => instance.payments.fetch(paymentId),
  /**
 * gets the payment within the given dates
 * @param {Date} FromDate
 * @param {Date} ToDate
 */
  paymentsWithin: (FromDate, ToDate) => instance.payments.all({ from: FromDate, to: ToDate })
}

const Refund = (paymentId, amount, notes) => instance.payments.refund(paymentId, { amount, notes })
const GetBankTransferInfo = (paymentId) => instance.payments.bankTransfer(paymentId)
const EditCustomer = (customerId, name, email, contact) => instance.customers.edit(customerId, { name, email, contact })
const GetCustomerDetails = (customerId) => instance.customers.fetch(customerId)

const FetchSubscription = (subscriptionId) => instance.subscriptions.fetch(subscriptionId)
const GetAllSubscriptions = (params) => instance.subscriptions.all(params)
const CancelASubscription = (subscriptionId, cancelAtCycleEnd) => instance.subscriptions.cancel(subscriptionId, cancelAtCycleEnd)

const verifyAuthTransaction = (RazorPayPaymentId, razorPaySubscriptionId, razorPaySignature) => {
  const crypto = require('crypto')
  const secret = `${RazorPayPaymentId}|${razorPaySubscriptionId}`
  const hmac = crypto.createHmac('sha256', secret)
  const expectedSignature = hmac.digest('hex')
  return expectedSignature === razorPaySignature
}

const fetchplan = (planId) => instance.plans.fetch(planId)
const fetchAllPlan = (params) => instance.plans.all(params)
module.exports = {
  create: create,
  GetPaymentInfo: GetPaymentInfo,
  GetPaymentsWithin: GetPaymentsWithin,
  Refund: Refund,
  GetBankTransferInfo: GetBankTransferInfo,
  EditCustomer: EditCustomer,
  GetCustomerDetails: GetCustomerDetails,
  CreateSubscription: CreateSubscription,
  FetchSubscription: FetchSubscription,
  GetAllSubscriptions: GetAllSubscriptions,
  CancelASubscription: CancelASubscription,
  CreateAddon: CreateAddon,
  CreatePlan: CreatePlan,
  fetchplan: fetchplan,
  fetchAllPlan: fetchAllPlan,
  verifyAuthTransaction: verifyAuthTransaction
}
