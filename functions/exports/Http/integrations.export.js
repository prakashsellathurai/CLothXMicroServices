const functions = require('firebase-functions')
const express = require('express')
const cors = require('cors')
const app = express()
const FlipKartRouter = require('../../shared/utils/integrations/flipkart/router/router')
// Automatically allow cross-origin requests
app.use(cors({ origin: true }))
app.post('/', (req, res) => {
  console.log(req)
  res.json({success: true})
})
app.get('/', (req, res) => {
  console.log(req)
  res.json({success: true})
})
app.use('/flipkart', FlipKartRouter)

module.exports = functions.https.onRequest(app)
