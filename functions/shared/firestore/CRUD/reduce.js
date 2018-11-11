const db = require('./db')
const firestore = db.firestore
function productsOnLocalInventory (cartProducts) {
  let promises = []
  for (let index = 0; index < cartProducts.length; index++) {
    const cartProduct = cartProducts[index]
    let productUid = cartProduct.productUid
    let size = cartProduct.size
    let singleUnitPrize = cartProduct.singleUnitPrice
    let quantityToReduce = cartProduct.totalQuantity
    promises.push(ReduceProductQuantity(productUid, size, singleUnitPrize, quantityToReduce))
  }
  return Promise.all(promises)
}

function ReduceProductQuantity (storeId, productUid, size, singleUnitPrice, quantityToReduce) {
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

module.exports = {
  productsOnLocalInventory: productsOnLocalInventory
}
