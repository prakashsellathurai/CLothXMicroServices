const constant = require('../../../environment/CONSTANTS')
const RAZOR_PAY = require('razorpay')
const razorpay_instance = new RAZOR_PAY(constant.RAZORPAY_CREDENTIALS)