var http = require('http')

var options = {
  'method': 'POST',
  'hostname': 'api.msg91.com',
  'port': null,
  'path': '/api/v2/sendsms',
  'headers': {
    'authkey': '218768ACR9sivBp5b2a9c86',
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
})

req.write(JSON.stringify({ sender: 'SOCKET',
  route: '4',
  country: '91',
  sms:
   [ { message: 'Message1', to: [ '9843158807' ] } ] }))
req.end()
