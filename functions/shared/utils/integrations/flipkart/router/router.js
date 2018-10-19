'use strict'
const express = require('express')
const flipkartRouter = express.Router()
const getAccesToken = require('../Get_access_token')
const db = require('../../../../firestore/CRUD/db')
flipkartRouter.post('/accesstoken', (req, res) => {
  let clientid = req.query.client_id
  let clientSecret = req.query.client_secret
  let storeId = req.query.store_id
   return (!clientid) ? res.json({error: 'unknown query params', error_description:'client_id not provided' })
  : (!clientSecret) ? res.json({error: 'unknown query params', error_description:'client_secret not provided'})   : (!storeId) ? res.json({error: 'unknown query params', error_description:'store_id not provided' })
  : getAccesToken(clientid, clientSecret)
    .then((response) => (!response.error)
      ? db.saveFlipkartAccessTokenCredentials(storeId, clientid, clientSecret, response.access_token)
      .then(() => response)
      : response)
    .then((response) => db.LogOnflipkartAccessTokenTrigger(storeId, response))
    .then((response) => res.json(response))
    .catch(() => res.json({error: 'server error', error_description: 'server responded with status 500'}))
  })
module.exports = flipkartRouter
