// uncomment this while production
var env = require('../../environment/env')
var admin = require('../../environment/initAdmin').setCredentials()
const firestore = admin.firestore()
firestore.settings(env.FIRESTORE_SETTINGS)
const reward = require('./reward')
const log = require('./log')
const timestamp = require('./timestamp')
const associate = require('./associate')
const invoice = require('./invoice')
const save = require('./save')
const get = require('./get')
// const settings = {timestampsInSnapshots: true}
// this function relates to oncreateStore trigger won't work on other

function RandomPRNgenerator () {
  let Length = 5
  var keylistalpha = 'bcdfghjklmnpqrstvwxyz'
  var temp = ''
  for (var i = 0; i < Length; i++) {
    temp += keylistalpha.charAt(Math.floor(Math.random() * keylistalpha.length))
  }
  temp = temp
    .split('')
    .sort(function () {
      return 0.5 - Math.random()
    })
    .join('')
  return temp
}

function prnCheckLoop () {
  let PRN_VALUE_TO_TEST = RandomPRNgenerator()
  return new Promise(function (resolve) {
    firestore
      .collection(`products`)
      .where('prn', '==', `${PRN_VALUE_TO_TEST}`)
      .get()
      .then(queryResult =>
        resolve(queryResult.empty ? PRN_VALUE_TO_TEST : prnCheckLoop())
      )
  })
}

function LocalInventoryProductReturner (storeId, cartProducts) {
  let promises = []
  for (let index = 0; index < cartProducts.length; index++) {
    const cartProduct = cartProducts[index]
    let prn = cartProduct.prn
    let size = cartProduct.size
    let singleUnitPrize = cartProduct.singleUnitPrice
    let quantityToReturn = cartProduct.totalQuantity
    promises.push(
      ReturnProductQuantity(
        storeId,
        prn,
        size,
        singleUnitPrize,
        quantityToReturn
      )
    )
  }
  return Promise.all(promises)
}
function LocalInventoryProductReducer (storeId, cartProducts) {
  let promises = []
  for (let index = 0; index < cartProducts.length; index++) {
    const cartProduct = cartProducts[index]
    let prn = cartProduct.prn
    let size = cartProduct.size
    let singleUnitPrize = cartProduct.singleUnitPrice
    let quantityToReduce = cartProduct.totalQuantity
    promises.push(
      ReduceProductQuantity(
        storeId,
        prn,
        size,
        singleUnitPrize,
        quantityToReduce
      )
    )
  }
  return Promise.all(promises)
}
// integrations related db functions

const update = require('./update')
const _delete = require('./delete')
const assign = require('./assign')
module.exports = {
  firestore: firestore,
  admin: admin,
  get: get,
  save: save,
  update: update,
  assign: assign,
  _delete: _delete,
  reward: reward,
  log: log,
  timestamp: timestamp,
  associate: associate,
  invoice: invoice,
  prnCheckLoop: prnCheckLoop,
  RandomPRNgenerator: RandomPRNgenerator,
  LocalInventoryProductReducer: LocalInventoryProductReducer,
  LocalInventoryProductReturner: LocalInventoryProductReturner
}
