let admin = require('firebase-admin')
let firestore = admin.firestore()

function productsOnLocalInventory (cartProducts) {
  console.log(cartProducts)
  let promises = []
  for (let index = 0; index < cartProducts.length; index++) {
    const cartProduct = cartProducts[index]
    let productUid = cartProduct.productUid
    //let size = cartProduct.size
    let quantityToReturn = cartProduct.totalQuantity
    promises.push(ReturnProductQuantity(productUid, quantityToReturn))
  }
  return Promise.all(promises)
}

function ReturnProductQuantity (productUid, quantityToReturn) {

  let productDocRef = firestore
    .doc(`products/${productUid}`)
  return firestore
    .runTransaction(async transaction => {
      const doc = await transaction.get(productDocRef)
      console.log(doc.data())
      //let variants = doc.data().variants
      //let returnedVariants = returnStock(variants, size, quantityToReturn)
      doc.data().stock += quantityToReturn
      let returnedStock = doc.data().stock;
      return transaction.update(doc.ref, {stock: returnedStock}) })
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
