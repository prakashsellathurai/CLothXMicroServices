
const db = require('./db')
const firestore = db.firestore

function products (
  storeId,
  prn,
  size,
  singleUnitPrice,
  quantityToReduce
) {
  let productDocRef = firestore
    .collection(`products`)
    .where('prn', '==', `${prn}`)
    .where('storeId', '==', `${storeId}`)
  return firestore
    .runTransaction(transaction => {
      return transaction
        .get(productDocRef)
        .then(docs => {
          return docs
            .forEach(doc => {
              if (doc.exists) {
                let variants = doc.data().variants
                let reducedvariants = reduceStock(
                  variants,
                  singleUnitPrice,
                  size,
                  quantityToReduce
                )
                return transaction
                  .update(doc.ref, { variants: reducedvariants })
              } else {
                console.log('product doesnt exist with provided values')
                return Promise.resolve(1)
              }
            })
        })
    })
}

function reduceStock (variants, price, size, quantityToReduce) {
  for (var i = 0; i < variants.length; i++) {
    if (variants[i].price == price && variants[i].size === size) {
      // leave == since it compares two numbers
      variants[i].stock -= quantityToReduce
      return variants
    }
  }
  return null
}

module.exports = {
  products: products
}
