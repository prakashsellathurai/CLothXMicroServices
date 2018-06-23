'use strict'
var http = require('http')
var Constants = require('../../environment/CONSTANTS')
module.exports = function (PhoneNumber, Message) {
  var options = {
    'method': 'POST',
    'hostname': 'api.msg91.com',
    'port': null,
    'path': '/api/v2/sendsms',
    'headers': {
      'authkey': Constants.MSG_91_API_KEY,
      'content-type': 'application/json'
    }
  }

  var req = http.request(options, function (res) {
    var chunks = []

    res.on('data', function (chunk) {
      chunks.push(chunk)
    })

    res.on('end', function () {
      var body = Buffer.concat(chunks)
      console.log(body.toString())
    })
    req.on('error', function (err) {
      console.log(err)
    })
  })

  req.write(JSON.stringify({ sender: 'CLOTHX',
    route: '4',
    country: '91',
    sms:
       [ { message: Message, to: [ PhoneNumber ] } ] }))
  req.end()
}
