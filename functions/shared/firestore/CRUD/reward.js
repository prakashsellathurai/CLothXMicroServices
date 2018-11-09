const db = require('./db')
const firestore = db.firestore

function updateReturnCount (customerNo, totalReturn) {
  let docRef = firestore
    .doc(`customers/${customerNo}`)
  return firestore
    .runTransaction(t => {
      return t.get(docRef)
        .then((doc) => doc.data().totalProductsReturn)
        .then((currentReturnState) => t.set(docRef, { totalProductsReturn: currentReturnState + totalReturn },
          { merge: true }))
    })
}
function updateCustomer (customer) {
  let customerDocRef = firestore
    .doc(`customers/${customer.customerNo}`)
  let storeRewardsDocRef = firestore
    .doc(`customers/${customer.customerNo}/storeRewards/${customer.storeId}`)
  let exitingCustomerData = customer // if it needs to be updated
  return firestore
    .runTransaction(t => {
      return t
        .get(customerDocRef) // get customer
        .then((customerDoc) => {
          if (customerDoc.exists) {
            t.set(customerDocRef, { // create customer
              customerName: customer.customerName,
              noOfItemsPurchased: customer.totalQuantity,
              totalCostOfPurchase: customer.totalPrice,
              firstVisit: customer.createdOn,
              totalNoOfVisit: 1,
              totalProductsReturn: 0
            })
          } else {
            return t
              .get(customerDocRef)
              .then(customer => customer.data())
              .then((currentStateOfCustomerReward) => JSON.parse({
                noOfItemsPurchased: currentStateOfCustomerReward.noOfItemsPurchased +
        exitingCustomerData.totalQuantity,
                totalCostOfPurchase: currentStateOfCustomerReward.totalCostOfPurchase +
        exitingCustomerData.totalPrice,
                totalNoOfVisit: currentStateOfCustomerReward.totalNoOfVisit + 1,
                lastVisit: exitingCustomerData.createdOn
              }))
              .then((data) => t.update(customerDocRef, data)) // update reward
          }
        })
        .then(() => t.get(storeRewardsDocRef)) // get store reward
        .then((storeRewardDoc) => {
          if (storeRewardDoc.exists) {
            t.set(storeRewardsDocRef, {
              noOfItemsPurchased: customer.totalQuantity,
              totalCostOfPurchase: customer.totalPrice,
              firstVisit: customer.createdOn,
              totalNoOfVisit: 1
            }) // create new store reward
          } else {
            return t
              .get(storeRewardsDocRef)
              .then((storeRewardDoc) => storeRewardDoc.data())
              .then((currentStateOfCustomerReward) => JSON.parse({
                noOfItemsPurchased: currentStateOfCustomerReward.noOfItemsPurchased +
                  exitingCustomerData.totalQuantity,
                totalCostOfPurchase: currentStateOfCustomerReward.totalCostOfPurchase +
                  exitingCustomerData.totalPrice,
                totalNoOfVisit: currentStateOfCustomerReward.totalNoOfVisit + 1,
                lastVisit: exitingCustomerData.createdOn
              }))
              .then((data) => t.update(storeRewardDoc, data)) // update store reward
          }
        })
        .catch((err) => console.error(err))
    })
}

module.exports = {
  updateCustomer: updateCustomer,
  updateReturnCount: updateReturnCount
}
