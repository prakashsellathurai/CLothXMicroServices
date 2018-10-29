// uncomment this while production
var env = require('../../environment/env')
var admin = require('../../environment/initAdmin').setCredentials()
const firestore = admin.firestore()
firestore.settings(env.FIRESTORE_SETTINGS)
// const settings = {timestampsInSnapshots: true}
// this function relates to oncreateStore trigger won't work on other
function AssociateStoreInfoToUser (uid, storeId) {
  let docRef = firestore
    .collection('users')
    .where('uid', '==', `${uid}`)

  return firestore.runTransaction(t => {
    return t.get(docRef)
      .then(docs => {
        let promises = []
        docs.forEach(doc => {
          if (doc.exists) { promises.push(doc.data()) }
        })
        return Promise.all(promises)
      })
      .then(array => array[0])
      .then(userDoc => {
        let registeredStores = (userDoc.registerOf == null) ? [] : userDoc.registerOf
        let storeArray = MergeAndRemoveDuplicatesArray(registeredStores, storeId)
        let dataToUpdate = ((userDoc.isRegister == null) ? false : userDoc.isRegister) ? {
          registerOf: storeArray
        } : {
          isRegister: true,
          registerOf: storeArray,
          role: 'Register'
        }

        let userDocRef = firestore.doc(`users/${userDoc.email}`)
        t.update(userDocRef, dataToUpdate)
        let StorePropertyObj = {
          verificationStatus: 'pending',
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        }
        let StoreDOcRef = firestore.doc(`stores/${storeId}`)
        t.update(StoreDOcRef, StorePropertyObj)
        return userDoc.email
      })
  })
}
function MergeAndRemoveDuplicatesArray (array, string) {
  var c = array.concat(string)
  return c.filter(function (item, pos) { return c.indexOf(item) === pos })
}

function SetInvoicePendingStatusToFalse (storeId, invoiceId) {
  return setInvoicePendingStatus(storeId, invoiceId, 'false')
}
function updateInvoicePendingStatus (storeId, invoiceId, UPDATE_STATUS_BOOLEAN) {
  return firestore
    .doc(`stores/${storeId}/invoices/${invoiceId}`)
    .update({
      pending: `${UPDATE_STATUS_BOOLEAN}`,
      updatedOn: admin.firestore.FieldValue.serverTimestamp()})
}
function setInvoicePendingStatus (storeId, invoiceId, UPDATE_STATUS_BOOLEAN) {
  return firestore
    .doc(`stores/${storeId}/invoices/${invoiceId}`)
    .update({
      pending: `${UPDATE_STATUS_BOOLEAN}`,
      createdOn: admin.firestore.FieldValue.serverTimestamp()})
}

function SetProductPRN (productId, PRN_VALUE) {
  return firestore
    .doc(`/products/${productId}`)
    .update({
      prn: PRN_VALUE,
      createdOn: admin.firestore.FieldValue.serverTimestamp()
    })
}
function RandomPRNgenerator () {
  let Length = 5
  var keylistalpha = 'bcdfghjklmnpqrstvwxyz'
  var temp = ''
  for (var i = 0; i < Length; i++) { temp += keylistalpha.charAt(Math.floor(Math.random() * keylistalpha.length)) }
  temp = temp.split('').sort(function () { return 0.5 - Math.random() }).join('')
  return temp
}

function prnCheckLoop () {
  let PRN_VALUE_TO_TEST = RandomPRNgenerator()
  return new Promise(function (resolve) {
    firestore
      .collection(`products`)
      .where('prn', '==', `${PRN_VALUE_TO_TEST}`)
      .get()
      .then(queryResult => resolve((queryResult.empty) ? (PRN_VALUE_TO_TEST) : (prnCheckLoop())))
  })
}
function LocalInventoryProductReturner (storeId, cartProducts) {
  let promises = []
  for (let index = 0; index < cartProducts.length; index++) {
    const cartProduct = cartProducts[index]
    let prn = cartProduct.prn
    let size = cartProduct.size
    let singleUnitPrize = cartProduct.singleUnitPrice
    let quantityToReturn = cartProduct.totalQuantity
    promises.push(ReturnProductQuantity(storeId, prn, size, singleUnitPrize, quantityToReturn))
  }
  return Promise.all(promises)
}
function ReturnProductQuantity (storeId, prn, size, singleUnitPrice, quantityToReturn) {
  let productDocRef = firestore
    .collection(`products`)
    .where('prn', '==', `${prn}`)
    .where('storeId', '==', `${storeId}`)
  return firestore
    .runTransaction(transaction => {
      return transaction
        .get(productDocRef)
        .then((docs) => {
          return docs
            .forEach(doc => {
              let ssp = doc.data().ssp
              let returnedssp = returnStock(ssp, singleUnitPrice, size, quantityToReturn)
              return transaction.update(doc.ref, {ssp: returnedssp})
            })
        })
    })
}
function returnStock (ssp, price, size, quantityToReturn) {
  for (var i = 0; i < ssp.length; i++) {
    if (ssp[i].price == price && ssp[i].size === size) { // leave == since it compares two numbers
      ssp[i].stock += quantityToReturn
      return ssp
    }
  }
  return null
}
function LocalInventoryProductReducer (storeId, cartProducts) {
  let promises = []
  for (let index = 0; index < cartProducts.length; index++) {
    const cartProduct = cartProducts[index]
    let prn = cartProduct.prn
    let size = cartProduct.size
    let singleUnitPrize = cartProduct.singleUnitPrice
    let quantityToReduce = cartProduct.totalQuantity
    promises.push(ReduceProductQuantity(storeId, prn, size, singleUnitPrize, quantityToReduce))
  }
  return Promise.all(promises)
}
function ReduceProductQuantity (storeId, prn, size, singleUnitPrice, quantityToReduce) {
  let productDocRef = firestore
    .collection(`products`)
    .where('prn', '==', `${prn}`)
    .where('storeId', '==', `${storeId}`)
  return firestore
    .runTransaction(transaction => {
      return transaction
        .get(productDocRef)
        .then((docs) => {
          return docs
            .forEach(doc => {
              let ssp = doc.data().ssp
              let reducedssp = reduceStock(ssp, singleUnitPrice, size, quantityToReduce)
              return transaction.update(doc.ref, {ssp: reducedssp})
            })
        })
    })
}
function reduceStock (ssp, price, size, quantityToReduce) {
  for (var i = 0; i < ssp.length; i++) {
    if (ssp[i].price == price && ssp[i].size === size) { // leave == since it compares two numbers
      ssp[i].stock -= quantityToReduce
      return ssp
    }
  }
  return null
}
// integrations related db functions

function saveFlipkartAccessTokenCredentials (storeId, clientId, clientSecret, accessToken) {
  let obj = {
    accessToken: `${accessToken}`,
    appId: `${clientId}`,
    appSecret: `${clientSecret}`
  }
  return firestore
    .doc(`stores/${storeId}/integrations/flipkart`)
    .update(obj)
}
function LogOnflipkartAccessTokenTrigger (storeId, response) {
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
function logonFlipkartCreateListings (storeId, response) {
  let obj = {
    response: JSON.parse(response),
    event: 'create listings request',
    timeStamp: admin.firestore.FieldValue.serverTimestamp()
  }
  return LogOnFlipkartEvents(storeId, obj)
}
function logOnFlipkartUpdateListings (storeId, response) {
  let obj = {
    response: JSON.parse(response),
    event: 'update listings request',
    timeStamp: admin.firestore.FieldValue.serverTimestamp()
  }
  return LogOnFlipkartEvents(storeId, obj)
}
function logOnPriceUpdate (storeId, response) {
  let obj = {
    response: JSON.parse(response),
    event: 'update price request',
    timeStamp: admin.firestore.FieldValue.serverTimestamp()
  }
  return LogOnFlipkartEvents(storeId, obj)
}
function logOnInventoryUpdate (storeId, response) {
  let obj = {
    response: JSON.parse(response),
    event: 'update Inventory request',
    timeStamp: admin.firestore.FieldValue.serverTimestamp()
  }
  return LogOnFlipkartEvents(storeId, obj)
}
function logPaymentAuthVerification (storeId, razorpaySubscriptionId, razorpayPaymentId) {
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
function saveRazorPayId (storeId, razorPayId) {
  return firestore
    .doc(`stores/${storeId}`)
    .update({
      razorPayPaymentId: razorPayId
    })
}
function GetRazorPayCustomerId (storeId) {
  return firestore
    .doc(`stores/${storeId}`)
    .get()
    .then((docRef) => docRef.data().razorPayPaymentId)
}
// Oncreate return related db operations
function deleteInvoice (storeId, invoiceId) {
  return firestore
    .doc(`stores/${storeId}/invoices/${invoiceId}`)
    .delete()
    .catch((err) => console.error(err))
}
function deletePendingBill (storeId, PendingBillId) {
  return firestore
    .doc(`stores/${storeId}/pendingbills/${PendingBillId}`)
    .delete()
}
function updateInvoiceOnProductsReturn (storeId, invoiceId, cartProducts) {
  let promises = []
  for (let index = 0; index < cartProducts.length; index++) {
    const cartProduct = cartProducts[index]
    let prn = cartProduct.prn
    let size = cartProduct.size
    let singleUnitPrize = cartProduct.singleUnitPrice
    let quantityToReturn = cartProduct.totalQuantity
    promises.push(ReduceProductQuantityOnInvoice(storeId, invoiceId, prn, size, singleUnitPrize, quantityToReturn))
  }
  return Promise.all(promises)
}
function ReduceProductQuantityOnInvoice (storeId, invoiceId, prn, size, singleUnitPrize, quantityToReturn) {
  let InvoiceDocRef = firestore
    .doc(`stores/${storeId}/invoices/${invoiceId}`)
  return firestore
    .runTransaction(transaction => {
      return transaction
        .get(InvoiceDocRef)
        .then((doc) => {
          let cartProductsToUpdate = doc.data().cartProducts
          for (let index = 0; index < cartProductsToUpdate.length; index++) {
            const cartProduct = cartProductsToUpdate[index]
            if (cartProduct.prn === prn && cartProduct.size === size && cartProduct.singleUnitPrice == singleUnitPrize) {
              cartProduct.totalQuantity -= quantityToReturn
              if (cartProduct.totalQuantity == 0) {
                if (index > -1) {
                  cartProductsToUpdate = cartProductsToUpdate.splice(index, 1)
                }
              }
            }
          }
          return transaction.update(doc.ref, {cartProducts: cartProductsToUpdate})
        })
    })
}
function assignRandomPendingBillToken (storeId, pendingBillId) {
  let obj = {
    pendingBillToken: getRndInteger(1, 10000)
  }
  return firestore
    .doc(`store/${storeId}/pendingbills/${pendingBillId}`)
    .update(obj)
}
function getRndInteger (min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}
function TimestampOnCreateReturn (storeId, returnId) {
  let obj = {
    createdOn: admin.firestore.FieldValue.serverTimestamp
  }
  return firestore
    .doc(`stores/${storeId}/returns/${returnId}`)
    .update(obj)
}
function TimestampOnUpdatedPendingBill (storeId, pendingBillId) {
  let obj = {
    updatedOn: admin.firestore.FieldValue.serverTimestamp
  }
  return firestore
    .doc(`stores/${storeId}/pendingbills/${pendingBillId}`)
    .update(obj)
}
module.exports = {
  AssociateStoreInfoToUser: AssociateStoreInfoToUser,
  ReduceProductQuantity: ReduceProductQuantity,
  UpdatInvoicePendingStatus: updateInvoicePendingStatus,
  SetInvoicePendingStatusToFalse: SetInvoicePendingStatusToFalse,
  SetProductPRN: SetProductPRN,
  prnCheckLoop: prnCheckLoop,
  RandomPRNgenerator: RandomPRNgenerator,
  LocalInventoryProductReducer: LocalInventoryProductReducer,
  saveFlipkartAccessTokenCredentials: saveFlipkartAccessTokenCredentials,
  LogOnflipkartAccessTokenTrigger: LogOnflipkartAccessTokenTrigger,
  logonFlipkartCreateListings: logonFlipkartCreateListings,
  logOnFlipkartUpdateListings: logOnFlipkartUpdateListings,
  logOnPriceUpdate: logOnPriceUpdate,
  logOnInventoryUpdate: logOnInventoryUpdate,
  logPaymentAuthVerification: logPaymentAuthVerification,
  saveRazorPayId: saveRazorPayId,
  GetRazorPayCustomerId: GetRazorPayCustomerId,
  deleteInvoice: deleteInvoice,
  LocalInventoryProductReturner: LocalInventoryProductReturner,
  updateInvoiceOnProductsReturn: updateInvoiceOnProductsReturn,
  deletePendingBill: deletePendingBill,
  assignRandomPendingBillToken: assignRandomPendingBillToken,
  TimestampOnCreateReturn: TimestampOnCreateReturn,
  TimestampOnUpdatedPendingBill: TimestampOnUpdatedPendingBill
}
