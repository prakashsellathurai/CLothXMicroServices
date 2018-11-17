const db = require('./../../CRUD/index')
const firestore = db.firestore
function accessTokenCredentials (storeId, clientId, clientSecret, accessToken) {
  let obj = {
    accessToken: `${accessToken}`,
    appId: `${clientId}`,
    appSecret: `${clientSecret}`
  }
  return firestore
    .doc(`stores/${storeId}/integrations/flipkart`)
    .update(obj)
}
module.exports = {
  accessTokenCredentials: accessTokenCredentials
}
