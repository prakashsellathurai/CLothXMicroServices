let admin = require('firebase-admin')
let firestore = admin.firestore()
/**
 * logs the product search queries
 * @param {object} object representing search query
 * @returns {object} A Promise resolved with a DocumentReference pointing to the newly created document after it has been written to the backend.
 */
const productSearch = (query) => firestore
  .collection('queries')
  .add({
    ...query,
    timestamp: admin.firestore.FieldValue.serverTimestamp()
  })
module.exports = {
  productSearch: productSearch
}
