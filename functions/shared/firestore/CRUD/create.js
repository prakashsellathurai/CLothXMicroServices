let admin = require('firebase-admin')
let firestore = admin.firestore()
/**
 * stores the store data in firestore
 * @param {string} storeId storeId String
 * @param {object} obj json object representing store document
 * @return — A Promise resolved with the write time of this set.
 */
function store (storeId, obj) {
  return firestore
    .doc(`stores/${storeId}`)
    .set(obj)
}
module.exports = {
  store: store
}
