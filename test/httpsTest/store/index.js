
var admin = require('firebase-admin')

var serviceAccount = require('../../../functions/environment/clothxnet-firebase-adminsdk-wkk1h-a27faaab6d.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://clothxnet.firebaseio.com'

})
var SHA256 = require('../../../functions/node_modules/crypto-js/sha256')
var firestore = admin.firestore()
var bodyParser = require('body-parser')
const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors({ origin: true }))
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())
app.post('', (req, res) => signupRequestHandler(req, res))
app.post('/', (req, res) => signupRequestHandler(req, res))

app.listen(8080, console.log('listening on 8080'))
// creator note destroy the DbIndex to start from zero
// module.exports = functions.https.onRequest(app)
// request handler
// ###############################################################################################
// ++++++++++++++++++++++++++++++CORE HANDLER+++++====================================+

function signupRequestHandler (req, res) {
  let postedData = ParsereqHeader(req)
  let OwnerInfo = ParseOwnerInfo(postedData)
  console.log(JSON.parse(JSON.stringify(req.body)))
  console.log(postedData)
  /*
  return CountSize().then(count => {
    count = (req.body.regno) ? req.body.regno : count
    return checkIfsidExist(count).then(val => {
      if (!val) {
        return createStore(count, postedData).then(() => {
          return createEmployee(count, OwnerInfo).then((val) => {
            return IncStoreIndex().then((val) => res.json({msg: 'StoreADDED SUCCESFULLY'}))
          })
        })
      } else {
        res.json({msg: 'store id already exist'})
      }
    })
  }) */
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
// 000000000000000000000000000000000 REQUEST PARSER =======================================================
function ParsereqHeader (req) {
  return {
    email: req.body.email,
    mobileNo: req.body.ownermobileno,
    ownerPassword: Math.random().toString(36).slice(-8),
    ownerName: req.body.ownername,
    propriatorName: req.body.propriatorname,
    storeName: req.body.storename,
    address: req.body.address,
    createdAt: new Date(),
    monthlyRevenue: req.body.monthlyrevenue,
    contactNo: req.body.contactno,
    noOfUsers: req.body.noofusers,
    noOfWorkers: req.body.noofworkers,
    noOfBranches: req.body.noofbranches,
    panNo: req.body.panno,
    regNo: req.body.regno,
    coordinates: req.body.coordinates,
    uploads: req.body.uploads
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
  return firestore.collection(`stores/${sid}/employees`).doc(`${employeeDAta.mobileNo}`).set(RemoveUndefinedValues(employeeDAta))
}
function createStore (sid, postedData) {
  postedData['sid'] = sid
  return firestore.collection('stores').doc(`${sid}`).set(RemoveUndefinedValues(postedData))
}
function RemoveUndefinedValues (obj) {
  return JSON.parse(JSON.stringify(obj))
}
