'use strict'
const express = require('express')
const flipkartRouter = express.Router()
const getAccesToken = require('../Get_access_token')
const db = require('../../../../firestore/CRUD/db')
// route HAndlers
function accesstokenRouteHandler (req, res) {
  let clientid = req.query.client_id
  let clientSecret = req.query.client_secret
  let storeId = req.query.store_id

  return getAccesToken(clientid, clientSecret)
    .then((response) => (!response.error)
      ? db.saveFlipkartAccessTokenCredentials(storeId, clientid, clientSecret, response.access_token)
        .then(() => response)
      : response)
    .then((response) => db.LogOnflipkartAccessTokenTrigger(storeId, response))
    .then((response) => res.json(response))
    .catch(() => res.json({error: 'server error', error_description: 'server responded with status 500'}))
}

// routes
flipkartRouter.post('/accesstoken', (req, res) => accesstokenRouteHandler(req, res) )
flipkartRouter.post('/createlistings', (req, res) => {

})
flipkartRouter.post('/listings/update', (req, res) => {

})
flipkartRouter.get('/listings/{sku-ids}', (req, res) => {

})
flipkartRouter.post('/listings/update/price', (req, res) => {

})
flipkartRouter.post('/listings/update/inventory', (req, res) => {

})
module.exports = flipkartRouter
