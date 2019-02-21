'use strict'
const admin = require('firebase-admin')
const firestore = admin.firestore()
const reduce = require('./reduce')
/**
 * updates the customer reward in the firestore database
 * @param {number} customerNumber
 * @param {String} storeId
 * @param {String} customerName
 * @param {number} totalQuantity
 * @param {number} totalPrice
 * @param {Date} createdOn
 * @async
 * @returns {Promise} resolved Promise
 */
function customerReward (customerNumber, storeId, customerName, totalQuantity, totalPrice, createdOn) {
  let customerDocRef = firestore
    .doc(`customers/${customerNumber}`)
  let customerOnStoreDocRef = firestore
    .doc(`stores/${storeId}/customers/${customerNumber}`)

  return firestore
    .runTransaction(transaction => {
      return transaction
        .get(customerDocRef)
        .then((customerDataSnapshot) => {
          return transaction
            .get(customerOnStoreDocRef)
            .then((storeDocDataSnapshot) => {
              if (!customerDataSnapshot.exists) {
                let data = {
                  'customerName': customerName,
                  'noOfItemsPurchased': totalQuantity,
                  'totalCostOfPurchase': totalPrice,
                  'firstVisit': createdOn,
                  'totalNoOfVisit': 1,
                  'totalProductsReturn': 0,
                  'lastVisitInMilli': Date.now(),
                  'differenceInVisits': null
                }
                transaction.set(customerDocRef, data)
              } else {
                let currentStateOfCustomerReward = customerDataSnapshot.data()
                let data = {
                  'customerName': customerName,
                  'noOfItemsPurchased': currentStateOfCustomerReward.noOfItemsPurchased + totalQuantity,
                  'totalCostOfPurchase': currentStateOfCustomerReward.totalCostOfPurchase + totalPrice,
                  'totalNoOfVisit': currentStateOfCustomerReward.totalNoOfVisit + 1,
                  'lastVisit': createdOn,
                  'lastVisitInMilli': Date.now(),
                  'differenceInVisits': Date.now() - currentStateOfCustomerReward.lastVisitInMilli
                }
                transaction.set(customerDocRef, data, { merge: true })
              }
              if (!storeDocDataSnapshot.exists) {
                const rewardData = {
                  'customerName': customerName,
                  'noOfItemsPurchased': totalQuantity,
                  'totalCostOfPurchase': totalPrice,
                  'firstVisit': createdOn,
                  'totalNoOfVisit': 1,
                  'lastVisitInMilli': Date.now(),
                  'differenceInVisits': null
                }
                transaction.set(customerOnStoreDocRef, rewardData)
              } else {
                let currentStateOfCustomerReward = storeDocDataSnapshot.data()
                let rewardData = {
                  'customerName': customerName,
                  'noOfItemsPurchased': currentStateOfCustomerReward.noOfItemsPurchased + totalQuantity,
                  'totalCostOfPurchase': currentStateOfCustomerReward.totalCostOfPurchase + totalPrice,
                  'totalNoOfVisit': currentStateOfCustomerReward.totalNoOfVisit + 1,
                  'lastVisit': createdOn,
                  'lastVisitInMilli': Date.now(),
                  'differenceInVisits': Date.now() - currentStateOfCustomerReward
                }
                transaction.set(customerOnStoreDocRef, rewardData, { merge: true })
              }
            })
            .then(() => Promise.resolve())
        })
    }).then(() => Promise.resolve(200))
}

function invoiceOnProductsReturn (invoiceId, cartProducts) {
  let promises = []
  for (let index = 0; index < cartProducts.length; index++) {
    const cartProduct = cartProducts[index]
    let productUid = cartProduct.productUid
    // let size = cartProduct.size
    let singleUnitPrize = cartProduct.singleUnitPrice
    let quantityToReturn = cartProduct.totalQuantity
    promises.push(reduce.productsOnInvoice(invoiceId, productUid, singleUnitPrize, quantityToReturn))
  }
  return Promise.all(promises)
}

function invoicePendingStatus (invoiceId, UPDATE_STATUS_BOOLEAN) {
  return firestore
    .doc(`/invoices/${invoiceId}`)
    .set({
      pending: `${UPDATE_STATUS_BOOLEAN}`,
      createdOn: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      merge: true
    })
}

function returnCountInReward (customerNumber, totalReturn) {
  let customerDocRef = firestore
    .doc(`customers/${customerNumber}`)
  return firestore
    .runTransaction(t => {
      return t.get(customerDocRef)
        .then((customerDoc) => {
          let currentProductsReturn = customerDoc.data().totalProductsReturn
          currentProductsReturn = (typeof currentProductsReturn !== 'undefined') ? currentProductsReturn : 0
          t.update(customerDocRef, { totalProductsReturn: currentProductsReturn + totalReturn })
        })
    })
}
function store (storeid, obj) {
  return firestore
    .doc(`stores/${storeid}`)
    .update(obj)
}
module.exports = {
  customerReward: customerReward,
  invoiceOnProductsReturn: invoiceOnProductsReturn,
  invoicePendingStatus: invoicePendingStatus,
  returnCountInReward: returnCountInReward,
  store: store
}
