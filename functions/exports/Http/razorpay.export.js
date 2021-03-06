const functions = require('firebase-functions')
const express = require('express')
const cors = require('cors')
const app = express()
const subScriptionRouteHandler = require('./../../shared/utils/payment/router/subscription')
app.use(cors({origin: true}))
app.use('/subscription', subScriptionRouteHandler)
module.exports = functions.https.onRequest(app)
