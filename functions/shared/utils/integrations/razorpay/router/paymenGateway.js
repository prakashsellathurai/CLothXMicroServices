'use strict'
const express = require('express')
const paymentgatewayRouter = express.Router()

const path = require('path')

const expressJade = require('express-jade')

var viewsDir = path.join(__dirname, 'public')
var namespace = 'jade'
var jadeOptions = { pretty: true }

paymentgatewayRouter.get('/', expressJade(viewsDir, namespace, jadeOptions))

paymentgatewayRouter
  .post('/', (req, res) => {

  })
module.exports = paymentgatewayRouter
