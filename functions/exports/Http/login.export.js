var functions = require('firebase-functions')
var AuthrequestHandler = require('./public/login/loginhandler')
// auth app code

const express = require('express')
const compression = require('compression')
const cors = require('cors')
const helmet = require('helmet')
const login = express()

// Automatically allow cross-origin requests
login.use(cors({ origin: true }))
// allow gzip compression
login.use(compression())
// use helmet for safety
login.use(helmet())
// disable this header to eliminate targetted attacks
login.disable('x-powered-by')
// respond to post request '/'
login.post('/', (req, res) => AuthrequestHandler.requestHandler(req, res))

// Add middleware to authenticate requests

// Expose Express API as a single Cloud Function:
module.exports = functions.https.onRequest(login)
