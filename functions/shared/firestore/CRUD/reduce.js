let admin = require('firebase-admin')
let firestore = admin.firestore()

function productsOnLocalInventory (cartProducts) {
  let promises = []
  for (let index = 0; index < cartProducts.length; index++) {
    const cartProduct = cartProducts[index]
    let productUid = cartProduct.productUid
    let quantityToReduce = cartProduct.totalQuantity
    promises.push(reduceProductQuantity(productUid, quantityToReduce))
  }
  return Promise.all(promises)
}

function reduceProductQuantity (productUid, quantityToReduce) {
  let productDocRef = firestore
    .doc(`products/${productUid}`)
  return firestore
    .runTransaction(transaction => {
      return transaction
        .get(productDocRef)
        .then((doc) => {
          let reducedStock = doc.data().stock - quantityToReduce
          return transaction.update(doc.ref, { stock: reducedStock })
        })
    })
}

function reduceStock (variants, size, quantityToReduce) {
  for (var i = 0; i < variants.length; i++) {
    if (variants[i].size === size || variants[i].size == size) { // leave == since it compares two numbers
      variants[i].stock -= quantityToReduce
      return variants
    }
  }
  return variants
}

function productsOnInvoice (invoiceId, productUid, singleUnitPrize, quantityToReturn) {
  let InvoiceDocRef = firestore
    .doc(`invoices/${invoiceId}`)
  return firestore
    .runTransaction(transaction => {
      return transaction
        .get(InvoiceDocRef)
        .then((doc) => {
          let cartProductsToUpdate = doc.data().cartProducts
          for (let index = 0; index < cartProductsToUpdate.length; index++) {
            const cartProduct = cartProductsToUpdate[index]
            if (cartProduct.productUid === productUid && cartProduct.singleUnitPrice === singleUnitPrize) {
              cartProduct.totalQuantity -= quantityToReturn
              if (cartProduct.totalQuantity === 0) {
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

module.exports = {
  productsOnLocalInventory: productsOnLocalInventory,
  productsOnInvoice: productsOnInvoice
}
