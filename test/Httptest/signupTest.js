// ============================================= mock firebase env ==============================//
var admin = require('firebase-admin')

var serviceAccount = require('../config/clothxtest-firebase-adminsdk-0bpps-d5b0ba2238.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://clothxtest.firebaseio.com'

})
var jwt = require('../../functions/node_modules/jwt-simple')
var env = require('../../functions/environment/env')
var secret = env.SECRET_TOKEN
var firestore = admin.firestore()
// --------------------------------------------------- env end add this shit every test script --------
var SHA256 = require('../../functions/node_modules/crypto-js/sha256')
const express = require('express')
const app = express()
app.post('/', (req, res) => signupRequestHandler(req, res))

// remove app.listen in production export the express app
app.listen(3030, () => console.log('Example app listening on port 3000!'))
/*
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
=================================================================================================
=================================SAMPLE REQUEST ======================================================

var http = require("https");

var options = {
  "method": "POST",
  "hostname": "us-central1-clothxnet.cloudfunctions.net",
  "port": null,
  "path": "/Addemployee/",
  "headers": {
    "name": "vivin",
    "role": "data entry",
    "phonenumber": "9843158807",
    "password": "random",
    "isemployee": "true",
    "timestamp": "date",
    "currentrole": "owner",
    "currentusertoken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwaG9uZW51bWJlciI6IjY1NTY1IiwicGFzc3dvcmQiOiJrYXNoIiwic2lkIjoiMTIzNDU2In0.QcvimYTQv863UT0KPGg5FRhCCL_wY6R1QVlkDRJjvvc",
    "cache-control": "no-cache",
    "postman-token": "d62cd146-26df-3532-5eed-7347daa9ef59"
  }
};

var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});

req.end();=================================================================================
=============================================================================================
==========================================================================================
==================================================================================================
=+++++++++++++++++++++++++========+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%5
*/

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

function encode (phoneNumber, password, sid) { // encodes the json data
  var payload = {
    phonenumber: phoneNumber,
    password: password,
    sid: sid
  }
  return jwt.encode(payload, secret)
}
/* used encryption algorithm 'HS256' */
// ================================>>>>>>>>>>>>>>>>>>>>>
function decode (token) { // ===decodes the token into phonenumber , password , sid
  return jwt.decode(token, secret)
}