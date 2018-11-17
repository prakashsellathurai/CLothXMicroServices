const db = require('./../../CRUD/index')
const firestore = db.firestore
const admin = db.admin
function onAccessTokenTrigger (storeId, response) {
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

function onCreateListings (storeId, response) {
  let obj = {
    response: JSON.parse(response),
    event: 'create listings request',
    timeStamp: admin.firestore.FieldValue.serverTimestamp()
  }
  return LogOnFlipkartEvents(storeId, obj)
}

function onUpdateListings (storeId, response) {
  let obj = {
    response: JSON.parse(response),
    event: 'update listings request',
    timeStamp: admin.firestore.FieldValue.serverTimestamp()
  }
  return LogOnFlipkartEvents(storeId, obj)
}

function onPriceUpdate (storeId, response) {
  let obj = {
    response: JSON.parse(response),
    event: 'update price request',
    timeStamp: admin.firestore.FieldValue.serverTimestamp()
  }
  return LogOnFlipkartEvents(storeId, obj)
}

function onInventoryUpdate (storeId, response) {
  let obj = {
    response: JSON.parse(response),
    event: 'update Inventory request',
    timeStamp: admin.firestore.FieldValue.serverTimestamp()
  }
  return LogOnFlipkartEvents(storeId, obj)
}

function paymentAuthVerification (storeId, razorpaySubscriptionId, razorpayPaymentId) {
  let obj = {
    event: 'Auth transaction verified',
    event_details: {
      subscriptionId: razorpaySubscriptionId,
      paymentId: razorpayPaymentId
    }
  }
  return firestore
    .collection(`stores/${storeId}/payments`)
    .add(obj)
}
module.exports = {
  onAccessTokenTrigger: onAccessTokenTrigger,
  onCreateListings: onCreateListings,
  paymentAuthVerification: paymentAuthVerification,
  onInventoryUpdate: onInventoryUpdate,
  onPriceUpdate: onPriceUpdate,
  onUpdateListings: onUpdateListings
}
