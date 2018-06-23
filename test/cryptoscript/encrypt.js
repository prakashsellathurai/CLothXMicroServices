
var crypto = require('crypto')
var hash = crypto.createHash('sha256')
let hashUpdate = hash.update('a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3')
let generateHash = hashUpdate.digest('hex')
console.log(generateHash)