function verifyHash (RazorPayPaymentId, razorPaySubscriptionId, razorPaySignature) {
  const crypto = require('crypto')
  const secret = require('./../../../functions/shared/environment/env').RAZOR_PAY.KEY_SECRET
  const hmac = crypto.createHmac('sha256', `${RazorPayPaymentId}. '|' . ${razorPaySubscriptionId}${secret}`)
  let expectedSignature = hmac.digest('hex')
  return expectedSignature === razorPaySignature
}
