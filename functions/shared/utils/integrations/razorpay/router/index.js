const express = require('express')
const razorpayRouter = express.Router()

razorpayRouter.use('                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    ', require('./paymenGateway'))
razorpayRouter.use('subscription', require('./subscription'))

module.exports = razorpayRouter
