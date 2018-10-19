// uncomment this while production
var env = require('../../environment/env')
var admin = require('../../environment/initAdmin').setCredentials()
const firestore = admin.firestore()
firestore.settings(env.FIRESTORE_SETTINGS)
// const settings = {timestampsInSnapshots: true}

function getEmployeeeData (sid, employeeID) {
  return firestore.collection(`stores/${sid}/employees`).doc(`${employeeID}`).get()
}
function GetClothDoc (storeId, clothId) {
  return firestore.collection(`stores/${storeId}/clothes`).doc(`${clothId}`)
}
function checkIfEmployeeExist (sid, employeeId) {
  return getEmployeeeData(sid, employeeId).then((employeeDoc) => {
    return (employeeDoc.exists)
  })
}

function getstoreData (sid) {
  return firestore.collection('stores').doc(`${sid}`).get().then((resolvedvalue) => resolvedvalue.data())
}

function checkIfStoreDocExist (sid) {
  return firestore.collection('stores').doc(`${sid}`).get().then((doc) => {
    return (doc.exists)
  })
}
function GetOwner (sid) {
  return firestore.collection(`stores/${sid}/employees/`).where('role', '==', 'owner').get()
}
function GetClothCollection (storeId) {
  return firestore.collection(`stores/${storeId}/clothes`).get()
}

// ===================================================================== storeIndex related routines===========================================
function CountSize () {
  return GetStoreIndex().then(snap => {
    if (snap.exists && snap.data().storesCount) return snap.data().storesCount
    else {
      return IntiatiateStoreIndex().then((snap) => {
        return GetStoreIndex().then((snap) => snap.data().storesCount)
      })
    }
  })
}
function IncStoreIndex () {
  return CountSize().then(count => {
    return firestore.collection('DbIndex').doc('stores').update({ storesCount: count + 1 })
  })
}
function DecStoreIndex () {
  return CountSize().then(count => {
    return firestore.collection('DbIndex').doc('stores').update({ storesCount: count - 1 })
  })
}
function GetStoreIndex () {
  return firestore.collection('DbIndex').doc('stores').get()
}
function IntiatiateStoreIndex () {
  return firestore.collection('DbIndex').doc('stores').set({ storesCount: 1001 }).then(() => { return 1001 })
}
// ======================================================END OF STORE INDEX ROUTINES ======================================
// =======================================================db functions for store add / employee add ====================
function createEmployee (sid, employeeDAta) {
  return firestore.collection(`stores/${sid}/employees`).doc(`${employeeDAta.mobileNo}`).set(employeeDAta)
}

function storeQueryBySid (sid) {
  return firestore.collection('stores').where('sid', '==', sid).get().then(val => {
    let promises = []
    if (val.empty) {
      return Promise.resolve([1000])
    } else {
      val.docs.forEach(doc => {
        promises.push(doc.id)
      })
      return Promise.all(promises)
    }
  })
}
function checkIfsidExist (sid) {
  return firestore.collection('stores').where('sid', '==', sid).get().then(val => {
    let promises = []
    val.docs.forEach(doc => {
      promises.push(doc.id)
    })
    return Promise.all(promises)
  }).then(arr => {
    return arr.length > 0
  })
}
// ############################# log related function ###############
function addstorelog (uuid, doc) {
  return firestore.collection('/DbIndex/stores/addstorelog').doc(uuid).set(RemoveUndefinedValues(doc))
}
function RemoveUndefinedValues (obj) {
  return JSON.parse(JSON.stringify(obj))
}
function EmployeePasswordResetLogger (sid, EmployeePhoneNUmber) {
  return firestore.collection(`/DbIndex/stores/passwordreset/`).add({
    sid: sid,
    phonenumber: EmployeePhoneNUmber,
    timestamp: new Date()
  })
}
function EmployeePasswordResetTokenGenerator (sid, EmployeePhoneNUmber) {
  return EmployeePasswordResetLogger(sid, EmployeePhoneNUmber).then(ref => ref.id)
}
function GetUserData (uuid) {
  return firestore
    .collection('users')
    .where('uid', '==', `${uuid}`)
    .get()
    .then(docs => {
      let promises = []
      docs.forEach(doc => {
        if (doc.exists) { promises.push(doc.data()) }
      })
      return Promise.all(promises)
    })
    .then(array => array[0])
    .then(doc => doc)
}
// this function relates to oncreateStore trigger won't work on other
function AssociateStoreInfoToUser (uid, storeId) {
  let docRef = firestore
    .collection('users')
    .where('uid', '==', `${uid}`)

  return firestore.runTransaction(t => {
    return t.get(docRef)
      .then(docs => {
        let promises = []
        docs.forEach(doc => {
          if (doc.exists) { promises.push(doc.data()) }
        })
        return Promise.all(promises)
      })
      .then(array => array[0])
      .then(userDoc => {
        let registeredStores = (userDoc.registerOf == null) ? [] : userDoc.registerOf
        let storeArray = MergeAndRemoveDuplicatesArray(registeredStores, storeId)
        let dataToUpdate = ((userDoc.isRegister == null) ? false : userDoc.isRegister) ? {
          registerOf: storeArray
        } : {
          isRegister: true,
          registerOf: storeArray,
          role: 'Register'
        }

        let userDocRef = firestore.doc(`users/${userDoc.email}`)
        t.update(userDocRef, dataToUpdate)
        let StorePropertyObj = {
          verificationStatus: 'pending',
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        }
        let StoreDOcRef = firestore.doc(`stores/${storeId}`)
        t.update(StoreDOcRef, StorePropertyObj)
      })
  })
}
function MergeAndRemoveDuplicatesArray (array, string) {
  var c = array.concat(string)
  return c.filter(function (item, pos) { return c.indexOf(item) === pos })
}

function SetInvoicePendingStatusToFalse (storeId, invoiceId) {
  return setInvoicePendingStatus(storeId, invoiceId, 'false')
}
function updateInvoicePendingStatus (storeId, invoiceId, UPDATE_STATUS_BOOLEAN) {
  return firestore
    .doc(`stores/${storeId}/invoices/${invoiceId}`)
    .update({
      pending: `${UPDATE_STATUS_BOOLEAN}`,
      updatedOn: admin.firestore.FieldValue.serverTimestamp()})
}
function setInvoicePendingStatus (storeId, invoiceId, UPDATE_STATUS_BOOLEAN) {
  return firestore
    .doc(`stores/${storeId}/invoices/${invoiceId}`)
    .update({
      pending: `${UPDATE_STATUS_BOOLEAN}`,
      createdOn: admin.firestore.FieldValue.serverTimestamp()})
}
function isEmptyArray (Arr) {
  return Arr.length === 0 || typeof Arr === 'undefined'
}
function SetProductPRN (productId, PRN_VALUE) {
  return firestore
    .doc(`/products/${productId}`)
    .update({
      prn: PRN_VALUE,
      createdOn: admin.firestore.FieldValue.serverTimestamp()
    })
}
function RandomPRNgenerator () {
  let Length = 5
  var keylistalpha = 'bcdfghjklmnpqrstvwxyz'
  var temp = ''
  for (var i = 0; i < Length; i++) { temp += keylistalpha.charAt(Math.floor(Math.random() * keylistalpha.length)) }
  temp = temp.split('').sort(function () { return 0.5 - Math.random() }).join('')
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
function LocalInventoryUpdater (storeId, cartProducts) {
  let promises = []
  for (let index = 0; index < cartProducts.length; index++) {
    const cartProduct = cartProducts[index]
    let prn = cartProduct.prn
    let size = cartProduct.size
    let singleUnitPrize = cartProduct.singleUnitPrice
    let quantityToReduce = cartProduct.totalQuantity
    promises.push(ReduceProductQuantity(storeId, prn, size, singleUnitPrize, quantityToReduce))
  }
  return Promise.all(promises)
}
function ReduceProductQuantity (storeId, prn, size, singleUnitPrice, quantityToReduce) {
  let productDocRef = firestore
    .collection(`products`)
    .where('prn', '==', `${prn}`)
    .where('storeId', '==', `${storeId}`)
  return firestore
    .runTransaction(transaction => {
      return transaction
        .get(productDocRef)
        .then((docs) => {
          return docs
            .forEach(doc => {
              let ssp = doc.data().ssp
              let reducedssp = reduceStock(ssp, singleUnitPrice, size, quantityToReduce)
              return transaction.update(doc.ref, {ssp: reducedssp})
            })
        })
    })
}
function reduceStock (ssp, price, size, quantityToReduce) {
  for (var i = 0; i < ssp.length; i++) {
    if (ssp[i].price == price && ssp[i].size === size) { // leave == since it compares two numbers
      ssp[i].stock -= quantityToReduce
      return ssp
    }
  }
  return null
}
// integrations related db functions

function saveFlipkartAccessTokenCredentials (storeId, clientId, clientSecret, accessToken) {
  let obj = {
    accessToken: `${accessToken}`,
    appId: `${clientId}`,
    appSecret: `${clientSecret}`
  }
  return firestore
    .doc(`stores/${storeId}/integrations/flipkart`)
    .update(obj)
}
function LogOnflipkartAccessTokenTrigger (storeId, response) {
  let obj = {
    response: JSON.parse(response),
    event: 'access token request',
    timeStamp: admin.firestore.FieldValue.serverTimestamp()
  }
  return LogOnFlipkartEvents(storeId, obj)
}
function LogOnFlipkartEvents (storeId, logObj) {
  return firestore
    .collection(`stores/${storeId}/integrations/flipkart/logs`)
    .add(logObj)
}
module.exports = {
  getEmployeedata: getEmployeeeData,
  checkIfStoreExist: checkIfStoreDocExist,
  getStoreData: getstoreData,
  checkIfEmployeeExist: checkIfEmployeeExist,
  GetOwner: GetOwner,
  GetClothCollection: GetClothCollection,
  GetClothDoc: GetClothDoc,
  createEmployee: createEmployee,
  IncStoreIndex: IncStoreIndex,
  DecStoreIndex: DecStoreIndex,
  storeQueryBySid: storeQueryBySid,
  checkIfsidExist: checkIfsidExist,
  CountSize: CountSize,
  GetUserData: GetUserData,
  addstorelog: addstorelog,
  EmployeePasswordResetTokenGenerator: EmployeePasswordResetTokenGenerator,
  AssociateStoreInfoToUser: AssociateStoreInfoToUser,
  ReduceProductQuantity: ReduceProductQuantity,
  UpdatInvoicePendingStatus: updateInvoicePendingStatus,
  SetInvoicePendingStatusToFalse: SetInvoicePendingStatusToFalse,
  SetProductPRN: SetProductPRN,
  prnCheckLoop: prnCheckLoop,
  RandomPRNgenerator: RandomPRNgenerator,
  LocalInventoryUpdater: LocalInventoryUpdater,
  saveFlipkartAccessTokenCredentials: saveFlipkartAccessTokenCredentials,
  LogOnflipkartAccessTokenTrigger: LogOnflipkartAccessTokenTrigger
}
