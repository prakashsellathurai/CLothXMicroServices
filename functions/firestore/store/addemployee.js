var functions = require('firebase-functions')
var admin = require('firebase-admin')
var firestore = admin.firestore()

const express = require('express')
const compression = require('compression')
const cors = require('cors')
const helmet = require('helmet')
const app = express()

var AuthTokenProvider = require('../../Auth/AuthToken')

// Automatically allow cross-origin requests
app.use(cors({ origin: true }))
// allow gzip compression
app.use(compression())
// use helmet for safety
app.use(helmet())
// disable this header to eliminate targetted attacks
app.disable('x-powered-by')
// respond to post request '/'
app.post('/', (req, res) => AddEmployeeRequestHandler(req, res))

// Add middleware to authenticate requests

// Expose Express API as a single Cloud Function:
module.exports = functions.https.onRequest(app)

// request handling code
function AddEmployeeRequestHandler (req, res) {
  const token = parseToken(req) // extract the token
  if (isUndefined(token)) {
    res.json({isError: true, error: 'AuthToken Not provided server refused to accept the operation'})
  } else {
    let AuthInfo = decodeToken(token)
    
  }
}
function parseToken (req) {
  return req.headers.token
}
function decodeToken (token) {
  return AuthTokenProvider.decode(token)
}
function isUndefined (obj) {
  return obj === null || obj === undefined || obj === 'undefined' || obj === 'null'
}
