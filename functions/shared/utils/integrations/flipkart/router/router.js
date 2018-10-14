'use strict'
const express = require('express')
const flipkartRouter = express.Router()
const getAccesToken = require('../Get_access_token')

flipkartRouter.post('/accesstoken', (req, res) => {
  let clientid = req.query.client_id
  let clientSecret = req.query.client_secret
  return getAccesToken(clientid, clientSecret)
    .then((response) => res.json(response))
})
module.exports = flipkartRouter
