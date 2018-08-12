var express = require('express')
var app = express()
const PORT = 3000
app.all('/', function (req, res) {
  console.log(req)
})
app.post('/', function (req, res) {
  console.log(req)
})
app.listen(PORT, console.log('listening on ' + PORT))
