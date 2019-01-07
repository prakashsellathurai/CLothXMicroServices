const functions = require('firebase-functions')
const express = require('express')
const cors = require('cors')
const app = express()

// router imports
const searchRouter = require('./../../shared/utils/integrations/algolia/router/search')

// router redirects
app.use(cors({ origin: true }))
app.use('/search', searchRouter)

module.exports = functions.https.onRequest(app)
