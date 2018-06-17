var jwt = require('jwt-simple')
var Constants = require('../environment/CONSTANTS')
var secret = Constants.SECRET_TOKEN

function encode (phoneNumber, password, sid) { // encodes the json data
  var payload = {
    phonenumber: phoneNumber,
    password: password,
    sid: sid
  }
  return jwt.encode(payload, secret)
}
/* used encryption algorithm 'HS256' */
// ================================>>>>>>>>>>>>>>>>>>>>>
function decode (token) { // ===decodes the token into phonenumber , password , sid
  return jwt.decode(token, secret)
}

module.exports = {
  encode: encode,
  decode: decode
}
