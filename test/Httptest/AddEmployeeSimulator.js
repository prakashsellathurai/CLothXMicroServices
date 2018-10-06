/*
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
    "postman-token": "545da8e7-6282-96c4-6fac-37cc0232e46d"
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

req.end();
*/

// ============================================= mock firebase env ==============================//
var admin = require('firebase-admin')

var serviceAccount = require('../config/clothxtest-firebase-adminsdk-0bpps-d5b0ba2238.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://clothxtest.firebaseio.com'

})
var firestore = admin.firestore()
// --------------------------------------------------- env end add this shit every test script --------
var SHA256 = require('../../functions/node_modules/crypto-js/sha256')
var jwt = require('../../functions/node_modules/jwt-simple')
var env = require('../../functions/environment/env')
var secret = env.SECRET_TOKEN
var SendMessage = require('../../functions/utils/message/SendMessage')
const express = require('express')
const app = express()
app.post('/', (req, res) => AddEmployeeSimulator(req, res))

// remove app.listen in production export the express app
app.listen(3000, () => console.log('Example app listening on port 3000!'))
function AddEmployeeSimulator (req, res) {
  return AddEmployeeRequestHandler(req, res)
}

// request handling code
function AddEmployeeRequestHandler (req, res) {
  const token = parseToken(req) // extract the token
  const reqObject = parseAddEmployeeReq(req)
  if (isUndefined(token)) {
    res.json({isError: true, error: 'AuthToken Not provided server refused to accept the operation'})
  } else {
    AuthTokenvalidator(token, res, reqObject)
  }
}
function parseAddEmployeeReq (req) {
  return req.headers
}
function AuthTokenvalidator (token, res, reqObject) {
  let AuthInfo = decodeToken(token)
  if (IsAuthInfoValid(AuthInfo, res)) {
    let employeeDetails = ReqObjectToEmployeeExtracter(reqObject)
    let employeePhoneNumber = reqObject.phonenumber
    let token = encode(employeePhoneNumber, reqObject.password, AuthInfo.sid)
    employeeDetails.token = token
    return storeEmployee(AuthInfo.sid, employeePhoneNumber, employeeDetails).then(() => {
      let Message = `Hello ${reqObject.name} your password is ${reqObject.password}`
      SendMessage(employeePhoneNumber, Message)
      res.json({isError: false, msg: 'employee added successfully'})
    })
  }
}
function IsAuthInfoValid (AuthInfo, res) {
  let phonenumber = AuthInfo.phonenumber
  let sid = AuthInfo.sid
  let password = AuthInfo.password
  if (!phonenumber) res.json({isError: true, error: 'phonenumber is not provided'})
  else if (!sid) res.json({isError: true, error: 'sid not provided'})
  else if (!password) res.json({isError: true, error: 'password not provided'})
  else if (!checkIfStoreExist()) res.json({isError: true, error: 'sid is not registered'})
  else return true
}
function parseToken (req) {
  return req.headers.currentusertoken
}
function decodeToken (token) {
  return decode(token)
}
function isUndefined (obj) {
  return obj === null || obj === undefined || obj === 'undefined' || obj === 'null'
}
function ReqObjectToEmployeeExtracter (reqObject) {
  return {
    name: reqObject.name,
    role: reqObject.role,
    password: reqObject.password,
    isEmployee: true,
    timestamp: new Date()
  }
}
function storeEmployee (sid, EmployeePhoneNUmber, employeeDetails) {
  employeeDetails.password = SHA256(employeeDetails.password).toString().toLowerCase() //  encrypt and save the password
  return firestore.collection(`stores/${sid}/employees/`).doc(`${EmployeePhoneNUmber}`).set(employeeDetails)
}
function checkIfStoreExist (sid) {
  return getstoreData(sid).then((doc) => {
    return (doc.exists)
  })
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

module.exports = {
  encode: encode,
  decode: decode
}
function getstoreData (sid) {
  return firestore.collection('stores').doc(`${sid}`).get()
}
