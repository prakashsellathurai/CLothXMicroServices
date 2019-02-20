var express = require('express')
var router = express.Router()
const razorpay_api = require('./../razorpay')

router.post('/', function (req, res, next) {
  let paymentId = req.body.razorpay_payment_id
  return razorpay_api.GetPaymentInfo(paymentId)
    .then((result) => {
      console.log(result)
      res.render('pay', {
        payment: 'payment success',
        body: req.body.razorpay_payment_id
      })
    })
    .catch((err) => {
    })
})

module.exports = router
