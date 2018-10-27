var express = require('express')
var router = express.Router()
const KEY_ID = require('./../../../../functions/shared/environment/env').RAZOR_PAY.KEY_ID
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'payment', KEY_ID: KEY_ID })
})

module.exports = router
