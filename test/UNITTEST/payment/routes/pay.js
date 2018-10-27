var express = require('express')
var router = express.Router()

router.post('/', function (req, res, next) {
  console.log(req.body)
  res.render('pay', {
    payment: 'payment success',
    body: req.body.razorpay_payment_id
  })
})

module.exports = router
