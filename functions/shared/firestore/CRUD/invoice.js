const db = require('./db')
const firestore = db.firestore
const admin = db.admin
function _delete (invoiceId) {
  return firestore
    .doc(`invoices/${invoiceId}`)
    .delete()
    .catch(err => console.error(err))
}
function updateOnProductsReturn (invoiceId, cartProducts) {
  let promises = []
  for (let index = 0; index < cartProducts.length; index++) {
    const cartProduct = cartProducts[index]
    let prn = cartProduct.prn
    let size = cartProduct.size
    let singleUnitPrize = cartProduct.singleUnitPrice
    let quantityToReturn = cartProduct.totalQuantity
    promises.push(
      ReduceProductQuantityOnInvoice(
        invoiceId,
        prn,
        size,
        singleUnitPrize,
        quantityToReturn
      )
    )
  }
  return Promise.all(promises)
}
function ReduceProductQuantityOnInvoice (
  invoiceId,
  prn,
  size,
  singleUnitPrize,
  quantityToReturn
) {
  let InvoiceDocRef = firestore.doc(`invoices/${invoiceId}`)
  return firestore.runTransaction(transaction => {
    return transaction.get(InvoiceDocRef).then(doc => {
      let cartProductsToUpdate = doc.data().cartProducts
      for (let index = 0; index < cartProductsToUpdate.length; index++) {
        const cartProduct = cartProductsToUpdate[index]
        if (
          cartProduct.prn === prn &&
            cartProduct.size === size &&
            cartProduct.singleUnitPrice == singleUnitPrize
        ) {
          cartProduct.totalQuantity -= quantityToReturn
          if (cartProduct.totalQuantity == 0) {
            if (index > -1) {
              cartProductsToUpdate = cartProductsToUpdate.splice(index, 1)
            }
          }
        }
      }
      return transaction.update(doc.ref, { cartProducts: cartProductsToUpdate })
    })
  })
}
function SetInvoicePendingStatusToFalse (invoiceId) {
  return setInvoicePendingStatus(invoiceId, 'false')
}

function updateInvoicePendingStatus (invoiceId, UPDATE_STATUS_BOOLEAN) {
  return firestore.doc(`/invoices/${invoiceId}`).update({
    pending: `${UPDATE_STATUS_BOOLEAN}`,
    updatedOn: admin.firestore.FieldValue.serverTimestamp()
  })
}
function setInvoicePendingStatus (invoiceId, UPDATE_STATUS_BOOLEAN) {
  return firestore.doc(`/invoices/${invoiceId}`).update({
    pending: `${UPDATE_STATUS_BOOLEAN}`,
    createdOn: admin.firestore.FieldValue.serverTimestamp()
  })
}

module.exports = {
  delete: _delete,
  updateOnProductsReturn: updateOnProductsReturn,
  UpdatInvoicePendingStatus: updateInvoicePendingStatus,
  SetInvoicePendingStatusToFalse: SetInvoicePendingStatusToFalse
}
