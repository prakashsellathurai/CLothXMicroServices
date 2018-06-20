
var functions = require('firebase-functions')
const express = require('express')

const AddShopapp = express()

var AuthTokenProvider = require('../../../functions/utils/cryptographicFunctions/AuthToken')
var dbFun = require('../../firestore/testdb')

// disable this header to eliminate targetted attacks
AddShopapp.disable('x-powered-by')
// respond to post request '/'
AddShopapp.post('/', (req, res) => AddEmployeeRequestHandler(req, res))

// Add middleware to authenticate requests

// Expose Express API as a single Cloud Function:
AddShopapp.listen(3030, () => {
  console.log('listennvevnvn;vnle')
})
module.exports = functions.https.onRequest(AddShopapp)

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
    return dbFun.AddEmployee(AuthInfo.sid, employeePhoneNumber, employeeDetails).then(() => {
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
  else if (!dbFun.checkIfStoreExist()) res.json({isError: true, error: 'sid is not registered'})
  else return true
}
function parseToken (req) {
  return req.headers.currentusertoken  // change to lower cas4
}
function decodeToken (token) {
  return AuthTokenProvider.decode(token)
}
function isUndefined (obj) {
  return obj === null || obj === undefined || obj === 'undefined' || obj === 'null'
}
function ReqObjectToEmployeeExtracter (reqObject) {
  return {
    name: reqObject.name,
    role: reqObject.role,
    password: reqObject.password,
    timestamp: reqObject.timestamp
  }
}
