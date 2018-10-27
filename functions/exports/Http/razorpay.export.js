const functions = require('firebase-functions')
const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors({origin: true}))

module.exports = functions.https.onRequest(app)
