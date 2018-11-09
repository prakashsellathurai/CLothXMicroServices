const db = require('./db')
const firestore = db.firestore
const admin = db.admin

function flipkartAccessTokenTrigger (storeId, response) {
  let obj = {
    response: JSON.parse(response),
    event: 'access token request',
    timeStamp: admin.firestore.FieldValue.serverTimestamp()
  }
  return LogOnFlipkartEvents(storeId, obj)
}

function LogOnFlipkartEvents (storeId, logObj) {
  return firestore
    .collection(`stores/${storeId}/integrations/flipkart/logs`)
    .add(logObj)
}

function FlipkartCreateListings (storeId, response) {
  let obj = {
    response: JSON.parse(response),
    event: 'create listings request',
    timeStamp: admin.firestore.FieldValue.serverTimestamp()
  }
  return LogOnFlipkartEvents(storeId, obj)
}

function FlipkartUpdateListings (storeId, response) {
  let obj = {
    response: JSON.parse(response),
    event: 'update listings request',
    timeStamp: admin.firestore.FieldValue.serverTimestamp()
  }
  return LogOnFlipkartEvents(storeId, obj)
}

function PriceUpdate (storeId, response) {
  let obj = {
    response: JSON.parse(response),
    event: 'update price request',
    timeStamp: admin.firestore.FieldValue.serverTimestamp()
  }
  return LogOnFlipkartEvents(storeId, obj)
}

function InventoryUpdate (storeId, response) {
  let obj = {
    response: JSON.parse(response),
    event: 'update Inventory request',
    timeStamp: admin.firestore.FieldValue.serverTimestamp()
  }
  return LogOnFlipkartEvents(storeId, obj)
}

function PaymentAuthVerification (
  storeId,
  razorpaySubscriptionId,
  razorpayPaymentId
) {
  let obj = {
    event: 'Auth transaction verified',
    event_details: {
      subscriptionId: razorpaySubscriptionId,
      paymentId: razorpayPaymentId
    }
  }
  return firestore.collection(`stores/${storeId}/payments`).add(obj)
}
module.exports = {
  flipkartAccessTokenTrigger: flipkartAccessTokenTrigger,
  FlipkartCreateListings: FlipkartCreateListings,
  FlipkartUpdateListings: FlipkartUpdateListings,
  PriceUpdate: PriceUpdate,
  InventoryUpdate: InventoryUpdate,
  PaymentAuthVerification: PaymentAuthVerification
}
