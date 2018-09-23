var async = require('asyncawait/async')
var await = require('asyncawait/await')
module.exports = {
    alreadyTriggered : (eventId) => async(function (eventId) {
    // Firestore doesn't support forward slash in ids and the eventId often has it
    const validEventId = eventId.replace('/', '')
  
    const firestore = firebase.firestore()
    return firestore.runTransaction(async(function(transaction) {
      const ref = firestore.doc(`eventIds/${validEventId}`)
      const doc = await(transaction.get(ref))
      if (doc.exists) {
        console.error(`Already triggered function for event: ${validEventId}`)
        return true
      } else {
        return false
      }
    }))
  })
}