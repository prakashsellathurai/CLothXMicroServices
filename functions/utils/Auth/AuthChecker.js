var AuthToken = require('../cryptographicFunctions/AuthToken')
var dbFunctions = require('../../firestore/CRUD/db')
module.exports = function AuthChecker (token) {
  let decodedToken = AuthToken.decode(token)
  let sid = decodedToken.sid

  return dbFunctions.checkIfStoreExist(sid).then((result) => {
    if (result) {

    } else {
      return false
    }
  })
}
