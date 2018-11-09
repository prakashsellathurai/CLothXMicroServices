'use strict'
const express = require('express')
const flipkartRouter = express.Router()
const getAccesToken = require('../Get_access_token')
const db = require('../../../../firestore/CRUD/db')
const createlisting = require('./../create_listings')
const updatelisting = require('./../update_listings')
const priceUpdate = require('./../update_price')
const inventoryUpdate = require('./../update_inventory')
// route HAndlers

function accesstokenRouteHandler (req, res) {
  let clientid = req.query.client_id
  let clientSecret = req.query.client_secret
  let storeId = req.query.store_id
  if (storeId == null) {
    res.json({
      error: 'unauthorized',
      error_description: 'store_id not given'
    })
  } else if (clientid == null) {
    res.json({
      error: 'unauthorized',
      error_description: 'client_id not given'
    })
  } else if (clientSecret == null) {
    res.json({
      error: 'unauthorized',
      error_description: 'client_secret not given'
    })
  } else {
    return getAccesToken(clientid, clientSecret)
      .then((response) => (!response.error)
        ? db.saveFlipkartAccessTokenCredentials(storeId, clientid, clientSecret, response.access_token)
          .then(() => response)
        : response)
      .then((response) => db.log.flipkartAccessTokenTrigger(storeId, response))
      .then((response) => res.json(response))
      .catch((err) => {
        console.log(err)
        res.json({error: 'server error', error_description: 'server responded with status 500'})
      })
  }
}
function createListingsHandler (Authorization, storeId, body, res) {
  return createlisting(Authorization, storeId, body)
    .then((response) => res.json(JSON.parse(response)))
}
function updateListingsHandler (Authorization, storeId, body, res) {
  return updatelisting(Authorization, storeId, body)
    .then((response) => res.json(JSON.parse(response)))
}
function updatePriceHandler (Authorization, storeId, body, res) {
  return priceUpdate(Authorization, storeId, body)
    .then((response) => res.json(JSON.parse(response)))
}
function updateInventoryHandler (Authorization, storeId, body, res) {
  return inventoryUpdate(Authorization, storeId, body)
    .then((response) => res.json(JSON.parse(response)))
}
// routes
flipkartRouter
  .post('/accesstoken', (req, res) => accesstokenRouteHandler(req, res))
flipkartRouter
  .post('/createlistings', (req, res) => createListingsHandler(req.query.Authorization, req.query.store_id, req.body, res))
flipkartRouter
  .post('/listings/update', (req, res) => updateListingsHandler(req.query.Authorization, req.query.store_id, req.body, res))
flipkartRouter
  .get('/listings/{sku-ids}', (req, res) => res.send(req.originalUrl))
flipkartRouter
  .post('/listings/update/price', (req, res) => updatePriceHandler(req.query.Authorization, req.query.store_id, req.body, res))
flipkartRouter
  .post('/listings/update/inventory', (req, res) => updateInventoryHandler(req.query.Authorization, req.query.store_id, req.body, res))
module.exports = flipkartRouter
