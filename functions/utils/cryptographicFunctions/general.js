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
function PasswordGenerator (plength) {
  var keylistalpha = 'abcdefghijklmnopqrstuvwxyz'
  var keylistint = '123456789'
  var keylistspec = '!@#'
  var temp = ''
  var len = plength / 2
  len = len - 1
  var lenspec = plength - len - len

  for (var i = 0; i < len; i++) { temp += keylistalpha.charAt(Math.floor(Math.random() * keylistalpha.length)) }
  for (var j = 0; j < lenspec; j++) { temp += keylistspec.charAt(Math.floor(Math.random() * keylistspec.length)) }
  for (var k = 0; k < len; k++) { temp += keylistint.charAt(Math.floor(Math.random() * keylistint.length)) }

  temp = temp.split('').sort(function () { return 0.5 - Math.random() }).join('')

  return temp
}
module.exports = {
  generateHash: generateHash,
  decryptHash: decryptHash,
  hashPassword: hashPassword,
  PasswordGenerator: PasswordGenerator
}
