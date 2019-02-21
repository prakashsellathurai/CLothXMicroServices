'use strict'
var db = require('./../../firestore/CRUD')
async function WithStoreId (storeId) {
  let products = await db.get.ProductInStore(storeId)
  
}
