var crypto = require('crypto')
const hashes = crypto.getHashes()
console.log(hashes) // ['DSA', 'DSA-SHA', 'DSA-SHA1', ...]
