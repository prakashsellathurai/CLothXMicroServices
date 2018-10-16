'use strict'
const express = require('express')
const flipkartRouter = express.Router()
const getAccesToken = require('../Get_access_token')
const db = require('../../../../firestore/CRUD/db')
flipkartRouter.post('/accesstoken', (req, res) => {
  let clientid = req.query.client_id
  let clientSecret = req.query.client_secret
  let storeId = req.query.store_id

  return getAccesToken(clientid, clientSecret)
    .then((response) => {
      if (!response.error) {
        return db.saveFlipkartAccessTokenCredentials(storeId, clientid, clientSecret, response.access_token)
          .then(() => response)
      }
      return response
    })
    .then((response) => res.json(response))
})
module.exports = flipkartRouter
