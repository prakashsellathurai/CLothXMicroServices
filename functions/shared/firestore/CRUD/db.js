// uncomment this while production
var env = require('../../environment/env')
var admin = require('../../environment/initAdmin').setCredentials()
const firestore = admin.firestore()
firestore.settings(env.FIRESTORE_SETTINGS)
const reward = require('./reward')
const log = require('./log')
const timestamp = require('./timestamp')
const associate = require('./associate')
const invoice = require('./invoice')
// const settings = {timestampsInSnapshots: true}
// this function relates to oncreateStore trigger won't work on other
function GetUserEmailByUUID (uid) {
  return firestore
    .collection('users')
    .where('uid', '==', `${uid}`)
    .get()
    .then(docs => {
      let promises = []
      docs.forEach(doc => {
        if (doc.exists) {
          promises.push(doc.data())
        }
      })
      return Promise.all(promises)
    })
    .then(array => array[0])
    .then(doc => doc.email)
}

function SetProductPRN (productId, PRN_VALUE) {
  return firestore.doc(`/products/${productId}`).update({
    prn: PRN_VALUE,
    createdOn: admin.firestore.FieldValue.serverTimestamp()
  })
}

function RandomPRNgenerator () {
  let Length = 5
  var keylistalpha = 'bcdfghjklmnpqrstvwxyz'
  var temp = ''
  for (var i = 0; i < Length; i++) {
    temp += keylistalpha.charAt(Math.floor(Math.random() * keylistalpha.length))
  }
  temp = temp
    .split('')
    .sort(function () {
      return 0.5 - Math.random()
    })
    .join('')
  return temp
}

function prnCheckLoop () {
  let PRN_VALUE_TO_TEST = RandomPRNgenerator()
  return new Promise(function (resolve) {
    firestore
      .collection(`products`)
      .where('prn', '==', `${PRN_VALUE_TO_TEST}`)
      .get()
      .then(queryResult =>
        resolve(queryResult.empty ? PRN_VALUE_TO_TEST : prnCheckLoop())
      )
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
    promises.push(
      ReturnProductQuantity(
        storeId,
        prn,
        size,
        singleUnitPrize,
        quantityToReturn
      )
    )
  }
  return Promise.all(promises)
}

function ReturnProductQuantity (
  storeId,
  prn,
  size,
  singleUnitPrice,
  quantityToReturn
) {
  let productDocRef = firestore
    .collection(`products`)
    .where('prn', '==', `${prn}`)
    .where('storeId', '==', `${storeId}`)
  return firestore.runTransaction(transaction => {
    return transaction.get(productDocRef).then(docs => {
      return docs.forEach(doc => {
        let ssp = doc.data().ssp
        let returnedssp = returnStock(
          ssp,
          singleUnitPrice,
          size,
          quantityToReturn
        )
        return transaction.update(doc.ref, { ssp: returnedssp })
      })
    })
  })
}

function returnStock (ssp, price, size, quantityToReturn) {
  for (var i = 0; i < ssp.length; i++) {
    if (ssp[i].price == price && ssp[i].size === size) {
      // leave == since it compares two numbers
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
    promises.push(
      ReduceProductQuantity(
        storeId,
        prn,
        size,
        singleUnitPrize,
        quantityToReduce
      )
    )
  }
  return Promise.all(promises)
}

function ReduceProductQuantity (
  storeId,
  prn,
  size,
  singleUnitPrice,
  quantityToReduce
) {
  let productDocRef = firestore
    .collection(`products`)
    .where('prn', '==', `${prn}`)
    .where('storeId', '==', `${storeId}`)
  return firestore.runTransaction(transaction => {
    return transaction.get(productDocRef).then(docs => {
      return docs.forEach(doc => {
        let ssp = doc.data().ssp
        let reducedssp = reduceStock(
          ssp,
          singleUnitPrice,
          size,
          quantityToReduce
        )
        return transaction.update(doc.ref, { ssp: reducedssp })
      })
    })
  })
}

function reduceStock (ssp, price, size, quantityToReduce) {
  for (var i = 0; i < ssp.length; i++) {
    if (ssp[i].price == price && ssp[i].size === size) {
      // leave == since it compares two numbers
      ssp[i].stock -= quantityToReduce
      return ssp
    }
  }
  return null
}

// integrations related db functions

function saveFlipkartAccessTokenCredentials (
  storeId,
  clientId,
  clientSecret,
  accessToken
) {
  let obj = {
    accessToken: `${accessToken}`,
    appId: `${clientId}`,
    appSecret: `${clientSecret}`
  }
  return firestore.doc(`stores/${storeId}/integrations/flipkart`).update(obj)
}

function saveRazorPayId (storeId, razorPayId) {
  return firestore.doc(`stores/${storeId}`).update({
    razorPayPaymentId: razorPayId
  })
}

function GetRazorPayCustomerId (storeId) {
  return firestore
    .doc(`stores/${storeId}`)
    .get()
    .then(docRef => docRef.data().razorPayPaymentId)
}


function deletePendingBill (storeId, PendingBillId) {
  return firestore
    .doc(`stores/${storeId}/pendingbills/${PendingBillId}`)
    .delete()
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

module.exports = {
  firestore: firestore,
  admin: admin,
  reward: reward,
  log: log,
  timestamp: timestamp,
  associate: associate,
  invoice: invoice,
  ReduceProductQuantity: ReduceProductQuantity,
  SetProductPRN: SetProductPRN,
  prnCheckLoop: prnCheckLoop,
  RandomPRNgenerator: RandomPRNgenerator,
  LocalInventoryProductReducer: LocalInventoryProductReducer,
  saveFlipkartAccessTokenCredentials: saveFlipkartAccessTokenCredentials,
  saveRazorPayId: saveRazorPayId,
  GetRazorPayCustomerId: GetRazorPayCustomerId,
  LocalInventoryProductReturner: LocalInventoryProductReturner,
  deletePendingBill: deletePendingBill,
  assignRandomPendingBillToken: assignRandomPendingBillToken,
  GetUserEmailByUUID: GetUserEmailByUUID
}
