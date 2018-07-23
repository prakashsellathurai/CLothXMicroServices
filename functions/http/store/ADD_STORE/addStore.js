const functions = require('firebase-functions')
const express = require('express')
const addstore = express()
const path = require('path')
const Busboy = require('busboy')
const compression = require('compression')
const cors = require('cors')
const helmet = require('helmet')

// debug
const os = require('os')
const fs = require('fs')
const tmpdir = os.tmpdir()

// custom
var uploadedFiles = []

const dbFun = require('../../../firestore/CRUD/db')
// ##################################################################
const gcloud = require('@google-cloud/storage')(
  { projectId: 'clothxnet' }
)
const bucket = gcloud.bucket('clothxnet.appspot.com')
// #########################################################################3
// Automatically allow cross-origin requests
addstore.use(cors({ origin: true }))
// allow gzip compression
addstore.use(compression())
// use helmet for safety
addstore.use(helmet())
addstore.use(express.static(path.join(__dirname, 'public')))
addstore.get('/', express.static(path.join(__dirname, 'public')))
addstore.get('/success', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/success.html'))
)
addstore.post('/submit', (req, res) => SubmitHandler(req, res))
function SubmitHandler (req, res) {
  var storeObj = {}
  const uploads = {}
  var busboy = new Busboy({ headers: req.headers })
  busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {

  })
  busboy.on('field', function (
    fieldname,
    val,
    fieldnameTruncated,
    valTruncated,
    encoding,
    mimetype
  ) {
    storeObj[fieldname] = (isNaN(Number(val)) || Number(val) === 0) ? val : Number(val)
  })
  busboy.on('finish', function () {

  })
}
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

function makeid () {
  var text = ''
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (var i = 0; i < 10; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}
