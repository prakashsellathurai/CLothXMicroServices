//= ===================================== IMPORTS ===============================================//
var functions = require('firebase-functions')
const db = require('../../../shared/firestore/CRUD/index')
function StockUpdater (document, oldDocument, storeId) {
  if (document === null) {
    let cartproducts = oldDocument.cartproducts
    return db
      .return
      .productsOnLocalInventory(storeId, cartproducts)
  } else {
    let cartProducts = document.cartProducts
    return db
      .reduce
      .productsOnLocalInventory(storeId, cartProducts)
  }
}
// ==================================================================================================
// =====================================export module================================================
module.exports = functions
  .firestore
  .document('stores/{storeId}/pendingbills/{pendingBillId}')
  .onWrite((change, context) => {
    const document = change.after.exists ? change.after.data() : null
    const oldDocument = change.before.data()
    const storeId = context.params.storeId
    const pendingBillId = context.params.pendingBillId
    return StockUpdater(document, oldDocument, storeId)
      .then(() => db
        .timestamp
        .OnUpdatedPendingBill(storeId, pendingBillId))
  })
