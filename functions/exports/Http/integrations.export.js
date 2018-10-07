const functions = require('firebase-functions')
const express = require('express')
const cors = require('cors')
const app = express()
// Automatically allow cross-origin requests
app.use(cors({ origin: true }))
app.post('/', (req, res) => {
  console.log(req)
  res.json({success: true})
})
app.post('/flipkart', (req, res) => {
  console.log(req)
  res.json({success: 'flipkart authentication success'})
})
module.exports = functions.https.onRequest(app)
