
const db = require('./db')
const firestore = db.firestore
function products (
  storeId,
  prn,
  size,
  singleUnitPrice,
  quantityToReturn
) {
  let productDocRef = firestore
    .collection(`products`)
    .where('prn', '==', `${prn}`)
    .where('storeId', '==', `${storeId}`)
  return firestore
    .runTransaction(transaction => {
      return transaction.get(productDocRef).then(docs => {
        return docs.forEach(doc => {
          let ssp = doc.data().ssp
          let returnedssp = returnStock(
            ssp,
            singleUnitPrice,
            size,
            quantityToReturn
          )
          return transaction.update(doc.ref, { ssp: returnedssp })
        })
      })
    })
}

function returnStock (ssp, price, size, quantityToReturn) {
  for (var i = 0; i < ssp.length; i++) {
    if (ssp[i].price == price && ssp[i].size === size) {
      // leave == since it compares two numbers
      ssp[i].stock += quantityToReturn
      return ssp
    }
  }
  return null
}

module.exports = {
  products: products
}
