let db = require('./index')
let admin = require('firebase-admin')
let firestore = admin.firestore()
let reduce = db.reduce

function customerReward (customer) {
  let customerDocRef = firestore
    .doc(`customers/${customer.customerNo}`)
  let customerOnStoreDocRef = firestore
    .doc(`stores/${customer.storeId}/customers/${customer.customerNo}`)

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
                  'customerName': customer.customerName,
                  'noOfItemsPurchased': customer.totalQuantity,
                  'totalCostOfPurchase': customer.totalPrice,
                  'firstVisit': customer.createdOn,
                  'totalNoOfVisit': 1,
                  'totalProductsReturn': 0,
                  'lastVisitInMilli': Date.now(),
                  'differenceInVisits': null
                }
                transaction.set(customerDocRef, data)
              } else {
                let currentStateOfCustomerReward = customerDataSnapshot.data()
                let exitingCustomerData = customer
                let data = {
                  'customerName': customer.customerName,
                  'noOfItemsPurchased': currentStateOfCustomerReward.noOfItemsPurchased + exitingCustomerData.totalQuantity,
                  'totalCostOfPurchase': currentStateOfCustomerReward.totalCostOfPurchase + exitingCustomerData.totalPrice,
                  'totalNoOfVisit': currentStateOfCustomerReward.totalNoOfVisit + 1,
                  'lastVisit': exitingCustomerData.createdOn,
                  'lastVisitInMilli': Date.now(),
                  'differenceInVisits': Date.now() - currentStateOfCustomerReward.lastVisitInMilli
                }
                transaction.set(customerDocRef, data, {merge: true})
              }
              if (!storeDocDataSnapshot.exists) {
                const rewardData = {
                  'customerName': customer.customerName,
                  'noOfItemsPurchased': customer.totalQuantity,
                  'totalCostOfPurchase': customer.totalPrice,
                  'firstVisit': customer.createdOn,
                  'totalNoOfVisit': 1,
                  'lastVisitInMilli': Date.now(),
                  'differenceInVisits': null
                }
                transaction.set(customerOnStoreDocRef, rewardData)
              } else {
                let currentStateOfCustomerReward = storeDocDataSnapshot.data()
                let exitingCustomerData = customer
                let rewardData = {
                  'customerName': customer.customerName,
                  'noOfItemsPurchased': currentStateOfCustomerReward.noOfItemsPurchased + exitingCustomerData.totalQuantity,
                  'totalCostOfPurchase': currentStateOfCustomerReward.totalCostOfPurchase + exitingCustomerData.totalPrice,
                  'totalNoOfVisit': currentStateOfCustomerReward.totalNoOfVisit + 1,
                  'lastVisit': exitingCustomerData.createdOn,
                  'lastVisitInMilli': Date.now(),
                  'differenceInVisits': Date.now() - currentStateOfCustomerReward
                }
                transaction.set(customerOnStoreDocRef, rewardData, { merge: true })
              }
            })
            .then(() => Promise.resolve())
        })
    })
}

function invoiceOnProductsReturn (invoiceId, cartProducts) {
  let promises = []
  for (let index = 0; index < cartProducts.length; index++) {
    const cartProduct = cartProducts[index]
    let productUid = cartProduct.productUid
    let size = cartProduct.size
    let singleUnitPrize = cartProduct.singleUnitPrice
    let quantityToReturn = cartProduct.totalQuantity
    promises.push(reduce.productsOnInvoice(invoiceId, productUid, size, singleUnitPrize, quantityToReturn))
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

function returnCountInReward (customerNo, totalReturn) {
  let customerDocRef = firestore
    .doc(`customers/${customerNo}`)
  return firestore
    .runTransaction(t => {
      return t.get(customerDocRef)
        .then((customerDoc) => {
          let currentProductsReturn = customerDoc.data().totalProductsReturn
          currentProductsReturn = (typeof currentProductsReturn !== 'undefined') ? currentProductsReturn : 0
          t.update(customerDocRef, {totalProductsReturn: currentProductsReturn + totalReturn})
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
