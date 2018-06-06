'use strict'
const functions = require('firebase-functions')
const CRNHandler = require('../utils/CRNmaintenanceEngine')
const CONSTANTS = require('../environment/CONSTANTS')
const CLOTHES_PATH = CONSTANTS.CLOTH_WILDCARD

const admin = require('firebase-admin')
try { admin.initializeApp() } catch (e) {}
const db = admin.firestore()

module.exports = function () {
  return functions.firestore.document(CLOTHES_PATH).onCreate((cloth, context) => {
    const clothdata = cloth.data()
    const clothId = context.params.clothId
    const userId = context.params.userId
    const userRef = db.collection(`user/`).doc(`${userId}`)
    return CRNHandler.adder(userId, clothId, clothdata, userRef)
  })
}
