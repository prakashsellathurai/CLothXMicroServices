var functions = require('firebase-functions')
const express = require('express')
const compression = require('compression')
const cors = require('cors')
const helmet = require('helmet')
var bodyParser = require('body-parser')
var SHA256 = require('../../node_modules/crypto-js/sha256')
var dbFun = require('../../firestore/CRUD/db')

const app = express()
app.use(bodyParser.urlencoded({
  extended: true
}))
// Automatically allow cross-origin requests
app.use(cors({ origin: true }))
// allow gzip compression
app.use(compression())
// use helmet for safety
app.use(helmet())
// disable this header to eliminate targetted attacks
app.disable('x-powered-by')
app.post('', (req, res) => signupRequestHandler(req, res))
app.post('/', (req, res) => signupRequestHandler(req, res))

module.exports = functions.https.onRequest(app)

// creator note destroy the DbIndex to start from zero
// module.exports = functions.https.onRequest(app)
// request handler
// ###############################################################################################
// ++++++++++++++++++++++++++++++CORE HANDLER+++++====================================+
function signupRequestHandler (req, res) {
  let postedData = ParsereqHeader(req)
  let OwnerInfo = ParseOwnerInfo(postedData)

  return dbFun.CountSize().then(count => {
    count = (req.body.regno) ? req.body.regno : count
    return dbFun.checkIfsidExist(count).then(val => {
      if (!val) {
        return dbFun.createStore(count, postedData).then(() => {
          return dbFun.createEmployee(count, OwnerInfo).then((val) => {
            return dbFun.IncStoreIndex().then((val) => res.json({msg: 'StoreADDED SUCCESFULLY'}))
          })
        })
      } else {
        res.json({msg: 'store id already exist'})
      }
    })
  })
}
// 000000000000000000000000000000000 REQUEST PARSER =======================================================
function ParsereqHeader (req) {
  return {
    email: req.body.email,
    mobileNo: req.body.mobileno,
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
