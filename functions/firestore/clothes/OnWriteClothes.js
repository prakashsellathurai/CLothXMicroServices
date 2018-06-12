var admin = require('firebase-admin')
var functions = require('firebase-functions')
var firestore = admin.firestore()

exports.OnwriteClothes = functions.firestore
  .document('user/{userId}/clothes/{clothId}')
  .onWrite((change, context) => {
    // Get an object with the current document value.
    // If the document does not exist, it has been deleted.
    const newDocument = change.after.exists ? change.after.data() : null

    // Get an object with the previous newDocument value (for update or delete)
    const oldDocument = change.before.data()

    // perform desired operations ...
    routeTheOP(newDocument, oldDocument)
  })
function IsExist (document) {
  return document !== false || document !== null || document !== undefined
}
function NOtExists (document) {
  return !IsExist(document)
}
function routeTheOP (newDocument, oldDocument) {
  if (NOtExists(oldDocument) && IsExist(newDocument)) { /* create the clothe */ }  
  else if (IsExist(oldDocument) && NOtExists(newDocument)) { /* delete the cloth */ }
}
