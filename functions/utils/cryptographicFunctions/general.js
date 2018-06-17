var tokenProvider = require('./AuthToken')
var SHA256 = require('crypto-js/sha256') // sha 256 algorithm

function generateHash (phoneNumber, password, sid) {
  return tokenProvider.encode(phoneNumber, password, sid)
}
function decryptHash (token) {
  return tokenProvider.decode(token)
}
function hashPassword (password) {
  return SHA256(password).toString().toLowerCase()
}
module.exports = {
  generateHash: generateHash,
  decryptHash: decryptHash,
  hashPassword: hashPassword
}
