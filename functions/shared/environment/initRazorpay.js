const env = require('./env')
const Razorpay = require('razorpay')
var path = require('path')
var fs = require('fs')
function withCredentials () {
  try {
    let deploymentProjectConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '/.deployenv'), 'utf8'))
    let credentials = (deploymentProjectConfig.production) ? env.RAZOR_PAY.prod : env.RAZOR_PAY.test
    let instance = new Razorpay(credentials)
    return instance
  } catch (error) {
    console.log(error)
  }
}
module.exports = {
  withCredentials: withCredentials
}
