var admin = require('firebase-admin')
var functions = require('firebase-functions')
var firestore = admin.firestore()
var SHA256 = require('crypto-js/sha256')

const express = require('express')
const app = express()
app.post('', (req, res) => signupRequestHandler(req, res))
app.post('/', (req, res) => signupRequestHandler(req, res))

module.exports = functions.https.onRequest(app)
// request handler
// ###############################################################################################
// ++++++++++++++++++++++++++++++CORE HANDLER+++++====================================+
function signupRequestHandler (req, res) {
  let postedData = ParsereqHeader(req)
  let OwnerInfo = ParseOwnerInfo(postedData)
  return CountSize().then(count => {
    count = (req.headers.regno) ? req.headers.regno : count
    return createStore(count, postedData).then(() => {
      return createEmployee(count, OwnerInfo).then((val) => {
        return IncStoreIndex().then((val) => res.json({msg: 'StoreADDED SUCCESFULLY'}))
      })
    })
  })
}
// 000000000000000000000000000000000 REQUEST PARSER =======================================================
function ParsereqHeader (req) {
  return {
    email: req.headers.email,
    mobileNo: req.headers.mobileno,
    ownerPassword: Math.random().toString(36).slice(-8),
    ownerName: req.headers.ownername,
    propriatorName: req.headers.propriatorname,
    storeName: req.headers.storename,
    address: req.headers.address,
    createdAt: new Date(),
    monthlyRevenue: req.headers.monthlyrevenue,
    contactNo: req.headers.contactno,
    noOfUsersRequired: req.headers.noofusersrequired,
    noOfWorkersRequired: req.headers.noofworkersrequired,
    noOfBranches: req.headers.noofbranches,
    panNo: req.headers.panno,
    regNo: req.headers.regno,

    uploads: {
      imagesPath: req.headers.imagespath,
      logoPath: req.headers.logopath
    }
  }
}
function ParseOwnerInfo (postedData) {
  return {
    isEmployee: false,
    name: postedData.ownerName,
    password: SHA256(postedData.ownerPassword).toString().toLowerCase(),
    role: 'owner',
    mobileNo: postedData.mobileNo
  }
}
// ===================================================================== storeIndex related routines===========================================
function CountSize () {
  return GetStoreIndex().then(snap => {
    if (snap.exists) return snap.data().storesCount
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
  return firestore.collection('DbIndex').doc('stores').set({ storesCount: 1000 }).then(() => { return 1000 })
}
// ======================================================END OF STORE INDEX ROUTINES ======================================
// =======================================================db functions for store add / employee add ====================
function createEmployee (sid, employeeDAta) {
  return firestore.collection(`stores/${sid}/employee`).doc(`${employeeDAta.mobileNo}`).set(RemoveUndefinedValues(employeeDAta))
}
function createStore (sid, postedData) {
  return firestore.collection('stores').doc(`${sid}`).set(RemoveUndefinedValues(postedData))
}
function RemoveUndefinedValues (obj) {
  return JSON.parse(JSON.stringify(obj))
}

