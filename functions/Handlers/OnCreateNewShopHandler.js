'use strict'
const functions = require('firebase-functions')

const onCreateNewShop = require('../auth/OnCreateNewShop')
module.exports = function () {
  return functions.firestore.document('/shops/{shopId}').onCreate((snap, context) => {
    const shopData = snap.data()
    const email = shopData.email
    return onCreateNewShop.sendMail(email)
  }
  )
}
