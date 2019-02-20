
let admin = require('firebase-admin')
let firestore = admin.firestore()

const product = (productUId, data) => firestore.doc(`products/${productUId}`).set(data)

module.exports = {
  product: product
}
