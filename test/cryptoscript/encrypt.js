
var crypto = require('crypto')
var hash = crypto.createHash('sha256')
let hashUpdate = hash.update('123')
let generateHash = hashUpdate.digest('hex')
console.log(generateHash)