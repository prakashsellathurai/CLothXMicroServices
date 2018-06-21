var http = require('http')

var options = {
  'method': 'POST',
  'hostname': 'api.msg91.com',
  'port': null,
  'path': '/api/v2/sendsms',
  'headers': {
    'authkey': '187762AxiHe71B5b2bf557',
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

req.write(JSON.stringify({ sender: 'CLOTHX',
  route: '4',
  country: '91',
  sms:
   [ { message: 'hello world', to: [ '9843158807' ] } ] }))
req.end()
