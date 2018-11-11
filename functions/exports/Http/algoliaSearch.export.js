const functions = require('firebase-functions')
const express = require('express')
const cors = require('cors')
const app = express()
const algoliaClient = require('../../shared/environment/initAlgoliaClient').withCredentials()
app.use(cors({ origin: true }))
app.post('/product_search', (req, res) => {
  const query = JSON.parse(req.query)
  let index = algoliaClient.initIndex('product_search')
  return index
    .search(query)
    .then((response) => {
      res.json(response.hits)
    })
})
app.post('/all', (req, res) => {

})

module.exports = functions.https.onRequest(app)
