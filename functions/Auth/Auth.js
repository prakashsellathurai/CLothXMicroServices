var functions = require('firebase-functions')
var AuthrequestHandler = require('./AuthRequestHandler')
// auth app code

const express = require('express')
const compression = require('compression')
const cors = require('cors')
const helmet = require('helmet')
const app = express()

// Automatically allow cross-origin requests
app.use(cors({ origin: true }))
// allow gzip compression
app.use(compression())
// use helmet for safety
app.use(helmet())
// disable this header to eliminate targetted attacks
app.disable('x-powered-by')
// respond to post request '/'
app.post('/', (req, res) => AuthrequestHandler.requestHandler(req, res))

// Add middleware to authenticate requests

// Expose Express API as a single Cloud Function:
module.exports = functions.https.onRequest(app)
