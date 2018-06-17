var jwt = require('jwt-simple')
var secret = 'qbjbEmQT64UiHe3FXHR'
function encode (phoneNumber, password, sid) {
  var payload = {
    phonenumber: phoneNumber,
    password: password,
    sid: sid
  }
  return jwt.encode(payload, secret)
}
function decode (token, secret) {
  return jwt.decode(token, secret)
}
