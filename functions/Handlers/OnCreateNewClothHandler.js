'use strict'
const functions = require('firebase-functions')
const CRNHandler = require('../utils/CRNmaintenanceEngine')
const CONSTANTS = require('../environment/CONSTANTS')
const CLOTHES_PATH = CONSTANTS.CLOTH_WILDCARD


module.exports = function () {
  return functions.firestore.document(CLOTHES_PATH).onCreate((cloth, context) => {
    const clothdata = cloth.data()
    const clothId = context.params.clothId
    const userId = context.params.userId
    return CRNHandler.adder(userId, clothId, clothdata)
  })
}
