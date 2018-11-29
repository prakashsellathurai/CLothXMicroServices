'use strict'
var http = require('http')
var env = require('../../environment/env')
module.exports = function (PhoneNumber, Message) {
  return new Promise(function (resolve, reject) {
    var options = {
      'method': 'POST',
      'hostname': 'api.msg91.com',
      'port': 80,
      'path': '/api/v2/sendsms',
      'headers': {
        'authkey': env.MSG_91_API_KEY,
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
        resolve(JSON.parse(JSON.stringify(body.toString())))
      })
      req.on('error', function (err) {
        console.log(err)
        reject(err)
      })
    })

    req.write(JSON.stringify({ sender: env.APP_NAME,
      route: '4',
      country: '91',
      sms:
       [ { message: Message, to: [ PhoneNumber ] } ] }))
    req.end()
  })
}
