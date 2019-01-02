/**
 * cloud https request module to handle api request
 *
 * @async
 * @description api request handler for clothx.net
 */
const functions = require('firebase-functions')
const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors({ origin: true }))

const apiHandler = require('./../../shared/utils/api/index')
app.use('/', apiHandler)

module.exports = functions.https.onRequest(app)
