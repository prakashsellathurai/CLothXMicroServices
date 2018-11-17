const db = require('./index')
const firestore = db.firestore
function productsOnLocalInventory (cartProducts) {
  let promises = []
  for (let index = 0; index < cartProducts.length; index++) {
    const cartProduct = cartProducts[index]
    let productUid = cartProduct.productUid
    let size = cartProduct.size
    let singleUnitPrize = cartProduct.singleUnitPrice
    let quantityToReduce = cartProduct.totalQuantity
    promises.push(reduceProductQuantity(productUid, size, singleUnitPrize, quantityToReduce))
  }
  return Promise.all(promises)
}

function reduceProductQuantity (productUid, size, quantityToReduce) {
  let productDocRef = firestore
    .doc(`products/${productUid}`)
  return firestore
    .runTransaction(transaction => {
      return transaction
        .get(productDocRef)
        .then((doc) => {
          let variants = doc.data().variants
          let reducedVariants = reduceStock(variants, size, quantityToReduce)
          return transaction.update(doc.ref, {variants: reducedVariants})
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

function productsOnInvoice (invoiceId, productUid, size, singleUnitPrize, quantityToReturn) {
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
            if (cartProduct.productUid === productUid && cartProduct.size === size && cartProduct.singleUnitPrice === singleUnitPrize) {
              cartProduct.totalQuantity -= quantityToReturn
              if (cartProduct.totalQuantity === 0) {
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

module.exports = {
  productsOnLocalInventory: productsOnLocalInventory,
  productsOnInvoice: productsOnInvoice
}
