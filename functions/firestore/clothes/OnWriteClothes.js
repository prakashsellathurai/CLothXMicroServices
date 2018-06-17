var admin = require('firebase-admin')
var functions = require('firebase-functions')


var firestore = admin.firestore()

var crnDelete = require('../../utils/crn/ondelete')
var crnCreate = require('../../utils/crn/oncreate')
exports.OnwriteClothes = functions.firestore
  .document('user/{userId}/clothes/{clothId}')
  .onWrite((change, context) => {
    // Get an object with the current document value.
    // If the document does not exist, it has been deleted.
    const newDocument = change.after.exists ? change.after.data() : null

    // Get an object with the previous newDocument value (for update or delete)
    const oldDocument = change.before.data()
    // local variables
    const userId = context.params.userId
    const clothId = context.params.clothId

    // db refrerences
    var userRef = firestore.collection('user').doc(userId)
    var clothRef = firestore.collection(`user/${userId}/clothes/`).doc(`${clothId}`)
    var crnContentref = firestore.collection(`user/${userId}/crnContent/`)
    // perform desired operations ...
 return routeTheOP(newDocument, oldDocument, userRef, clothRef, crnContentref, userId, clothId)
  })
function IsExist (document) {
  return document !== false || document !== null || document !== undefined
}
function NOtExists (document) {
  return !IsExist(document)
}
function routeTheOP (newDocument, oldDocument, userRef, clothRef, crnContentref, userId, clothId) {
  if (NOtExists(oldDocument) && IsExist(newDocument)) {
    return crnCreate.OncreateHandler(userRef, clothRef, crnContentref) /* create the clothe */
  } else if (IsExist(oldDocument) && NOtExists(newDocument)) {
    return crnDelete.ondeleteHandler(userRef, clothRef, crnContentref, oldDocument.crn, userId, clothId) /* delete the cloth */
  }
}
