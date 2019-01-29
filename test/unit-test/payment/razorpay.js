const Razorpay = require('razorpay')
const env = require('./../../../functions/shared/environment/env')
var instance = new Razorpay({
  key_id: env.RAZOR_PAY.KEY_ID,
  key_secret: env.RAZOR_PAY.KEY_SECRET
})
const GetPaymentInfo = (paymentId) => instance.payments.fetch(paymentId)
const GetPaymentsWithin = (FromDate, ToDate) => instance.payments.all({ from: FromDate, to: ToDate })
const Refund = (paymentId, amount, notes) => instance.payments.refund(paymentId, {amount, notes})
const GetBankTransferInfo = (paymentId) => instance.payments.bankTransfer(paymentId)
const CreateCustomer = (name, email, contact, notes) => instance.customers.create({name, email, contact, notes})
const EditCustomer = (customerId, name, email, contact, notes) => instance.customers.edit(customerId, {name, email, contact, notes})
const GetCustomerDetails = (customerId) => instance.customers.fetch(customerId)
const CreateSubscription = (params) => instance.subscriptions.create(params)
const FetchSubscription = (subscriptionId) => instance.subscriptions.fetch(subscriptionId)
const GetAllSubscriptions = (params) => instance.subscriptions.all(params)
const CancelASubscription = (subscriptionId, cancelAtCycleEnd) => instance.subscriptions.cancel(subscriptionId, cancelAtCycleEnd)
const CreateAddon = (subscriptionId, params) => instance.subscriptions.createAddon(subscriptionId, params)
const verifyAuthTransaction = (RazorPayPaymentId, razorPaySubscriptionId, razorPaySignature) => {
  const crypto = require('crypto')
  const hmac = crypto.createHmac('sha256', 'a secret')
  hmac.digest('hex')
}
const CreatePlan = (params) => instance.plans.create(params)
const fetchplan = (planId) => instance.plans.fetch(planId)
const fetchAllPlan = (params) => instance.plans.all(params)
module.exports = {
  GetPaymentInfo: GetPaymentInfo,
  GetPaymentsWithin: GetPaymentsWithin,
  Refund: Refund,
  GetBankTransferInfo: GetBankTransferInfo,
  CreateCustomer: CreateCustomer,
  EditCustomer: EditCustomer,
  GetCustomerDetails: GetCustomerDetails,
  CreateSubscription: CreateSubscription,
  FetchSubscription: FetchSubscription,
  GetAllSubscriptions: GetAllSubscriptions,
  CancelASubscription: CancelASubscription,
  CreateAddon: CreateAddon,
  CreatePlan: CreatePlan,
  fetchplan: fetchplan,
  fetchAllPlan: fetchAllPlan
}
