'use strict'
let admin = require('firebase-admin')
let firestore = admin.firestore()
function user (data) {
  return firestore.collection('users').doc(data.email).set(data)
}
function store (data) {
  return firestore.collection('stores').add(data)
}
function product (data) {
  return firestore.collection('products').doc(data.productUid).set(data)
}
module.exports = {
  user: user,
  store: store,
  product: product
}
