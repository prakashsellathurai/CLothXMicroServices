const db = require('./db')
const firestore = db.firestore
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
module.exports = {
  customerReward: customerReward
}
