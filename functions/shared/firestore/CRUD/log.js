let admin = require('firebase-admin')
let db = admin.database()
/**
 * logs the product search queries
 * @param {object} object representing search query
 * @returns {object} A Promise resolved with a DocumentReference pointing to the newly created document after it has been written to the backend.
 */
const productSearch = (query) => db
  .ref('logs/searches/products')
  .push({
    ...query,
    timestamp: admin.database.ServerValue.TIMESTAMP
  })

const storeSearch = (query, storId) => db
  .ref(`logs/searches/stores/${storId}`)
  .push({
    ...query,
    timestamp: admin.database.ServerValue.TIMESTAMP
  })
module.exports = {
  productSearch: productSearch,
  storeSearch: storeSearch
}
