let admin = require('firebase-admin')
let firestore = admin.firestore()
let flipkart = require('./flipkart/index')
let razorpay = require('./razorpay/index')
function RandomPRNgenerator () {
  let Length = 5
  var keylistalpha = 'bcdfghjklmnpqrstvwxyz'
  var temp = ''
  for (var i = 0; i < Length; i++) {
    temp += keylistalpha.charAt(Math.floor(Math.random() * keylistalpha.length))
  }
  temp = temp.split('').sort(function () {
    return 0.5 - Math.random()
  }).join('')
  return temp
}

function prnCheckLoop () {
  let PRN_VALUE_TO_TEST = RandomPRNgenerator()
  return new Promise(function (resolve) {
    firestore
      .collection(`products`)
      .where('prn', '==', `${PRN_VALUE_TO_TEST}`)
      .get()
      .then(queryResult => resolve((queryResult.empty) ? (PRN_VALUE_TO_TEST) : (prnCheckLoop())))
  })
}
const storeIdExists = async (storeId) => {
  var docRef = firestore.collection('stores').doc(`${storeId}`)
  let doc = await docRef.get()
  return doc.exists
}
const storeIdsExists = async (storeIds) => {
  for (var i in storeIds) {
    let storeId = storeIds[i]
    let isExist = await storeIdExists(storeId)
    if (isExist === false) return false
  }
  return true
}
const uidExist = async (uid) => {
  var docRef = firestore.collection('users').where('uid', '==', `${uid}`)
  let doc = await docRef.get()
  return !doc.empty
}

module.exports = {
  flipkart: flipkart,
  razorpay: razorpay,
  uidExist: uidExist,
  prnCheckLoop: prnCheckLoop,
  storeIdsExists: storeIdsExists,
  storeIdExists: storeIdExists
}
