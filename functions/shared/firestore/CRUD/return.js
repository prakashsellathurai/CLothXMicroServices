let admin = require('firebase-admin')
let firestore = admin.firestore()
function productsOnLocalInventory (storeId, cartProducts) {
  console.log(cartProducts)
  let promises = []
  for (let index = 0; index < cartProducts.length; index++) {
    const cartProduct = cartProducts[index]
    let productUid = cartProduct.productUid
    let size = cartProduct.size
    let quantityToReturn = cartProduct.totalQuantity
    promises.push(ReturnProductQuantity(productUid, size, quantityToReturn))
  }
  return Promise.all(promises)
}

function ReturnProductQuantity (productUid, size, quantityToReturn) {

  let productDocRef = firestore
    .doc(`products/${productUid}`)
  return firestore
    .runTransaction(async transaction => {
      const doc = await transaction.get(productDocRef)
      console.log(doc.data())
      let variants = doc.data().variants
      let returnedVariants = returnStock(variants, size, quantityToReturn)
      return transaction.update(doc.ref, { variants: returnedVariants })
    })
}

function returnStock (variants, size, quantityToReturn) {
  for (var i = 0; i < variants.length; i++) {
    if (variants[i].size === size || variants[i].size == size) { // leave == since it compares two numbers
      variants[i].stock += quantityToReturn
      return variants
    }
  }
  return variants
}
module.exports = {
  productsOnLocalInventory: productsOnLocalInventory
}
