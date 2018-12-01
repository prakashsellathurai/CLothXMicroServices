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
                  'totalProductsReturn': 0
                }
                transaction.set(customerDocRef, data)
              } else {
                let currentStateOfCustomerReward = customerDataSnapshot.data()
                let exitingCustomerData = customer
                let data = {
                  'noOfItemsPurchased': currentStateOfCustomerReward.noOfItemsPurchased + exitingCustomerData.totalQuantity,
                  'totalCostOfPurchase': currentStateOfCustomerReward.totalCostOfPurchase + exitingCustomerData.totalPrice,
                  'totalNoOfVisit': currentStateOfCustomerReward.totalNoOfVisit + 1,
                  'lastVisit': exitingCustomerData.createdOn
                }
                transaction.update(customerDocRef, data)
              }
              if (!storeDocDataSnapshot.exists) {
                const rewardData = {
                  'noOfItemsPurchased': customer.totalQuantity,
                  'totalCostOfPurchase': customer.totalPrice,
                  'firstVisit': customer.createdOn,
                  'totalNoOfVisit': 1
                }
                transaction.set(customerOnStoreDocRef, rewardData)
              } else {
                let currentStateOfCustomerReward = storeDocDataSnapshot.data()
                let exitingCustomerData = customer
                let rewardData = {
                  'noOfItemsPurchased': currentStateOfCustomerReward.noOfItemsPurchased + exitingCustomerData.totalQuantity,
                  'totalCostOfPurchase': currentStateOfCustomerReward.totalCostOfPurchase + exitingCustomerData.totalPrice,
                  'totalNoOfVisit': currentStateOfCustomerReward.totalNoOfVisit + 1,
                  'lastVisit': exitingCustomerData.createdOn
                }
                transaction.update(customerOnStoreDocRef, rewardData)
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
    .update({
      pending: `${UPDATE_STATUS_BOOLEAN}`,
      createdOn: admin.firestore.FieldValue.serverTimestamp()
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
module.exports = {
  customerReward: customerReward,
  invoiceOnProductsReturn: invoiceOnProductsReturn,
  invoicePendingStatus: invoicePendingStatus,
  returnCountInReward: returnCountInReward
}