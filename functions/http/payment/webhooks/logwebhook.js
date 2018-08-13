var functions = require('firebase-functions')

const express = require('express')
const compression = require('compression')
const cors = require('cors')
const helmet = require('helmet')
const bodyparser = require('body-parser')
const log = express()

// Automatically allow cross-origin requests
log.use(cors({ origin: true }))
// allow gzip compression
log.use(compression())
// use helmet for safety
log.use(helmet())
// disable this header to eliminate targetted attacks
log.disable('x-powered-by')
log.use(bodyparser.json())
log.use(bodyparser.urlencoded())
log.post('/', (req, res) => {
  console.log(req.body)
  res.send(req.body)
})

module.exports = functions.https.onRequest(log)
