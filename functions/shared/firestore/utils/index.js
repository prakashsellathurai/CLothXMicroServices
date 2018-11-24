const db = require('./../CRUD/index')
const firestore = db.firestore
const flipkart = require('./flipkart/index')
const razorpay = require('./razorpay/index')
const sms = require('./sms/index')
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

module.exports = {
  flipkart: flipkart,
  razorpay: razorpay,
  sms: sms,
  prnCheckLoop: prnCheckLoop
}
