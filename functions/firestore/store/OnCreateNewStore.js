//= ===================================== IMPORTS ===============================================//
var functions = require('firebase-functions')
var dbFun = require('../CRUD/db')
var sendEmail = require('../../utils/Mail/sendmail')
var sendMessage = require('../../utils/message/SendMessage')
var UpdateAbsolutePathHandler = require('../../utils/storage/UpdateAbsolutePath')
// ++++++++++++++++++++++++++++++++++++++++++++++++BUNDLED MODULE ====================================
// ===================================================================================================
// ============script runs whenever a new store is added under the location /stores/{sid}=============
// ===================================================================================================
// ===================================================================================================
// ======================================HELPER FUNCTIONS=============================================
function ParseSnapAndContext (snap, context) {
  return [context.params.storeId,
    snap.data().email,
    snap.data().ownerName,
    snap.data().ownerPassword,
    snap.data().storeName]
}
function GetPhoneNumber (storeId) {
  return dbFun.GetOwner(storeId)
}

function PassEncryptHandler (storeId, ownerphoneNumber, Password) {
  return dbFun.encryptThePasswordOnCreate(storeId, ownerphoneNumber, Password)
}
// =====================================================================================
// ------------------------------------------------------------------------------------
// ================================EMAIL ==============================================
// ------------------------------------------------------------------------------------
function EmailHAndler (email, ownerName, storeName, storeId, ownerphoneNumber, Password) {
  return sendEmail(email, 'confirmation mail from clothxnet', `hello ${ownerName}`, htmlMessage(storeName, storeId, ownerphoneNumber, Password))
}
function htmlMessage (storeName, storeId, ownerphoneNumber, Password) {
  return `<p>your store ${storeName} /storeId ${storeId} has been registered successfully to clothx net with phone number ${ownerphoneNumber} and password ${Password} </p>`
}
/*
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
===============================SMS ============================================================
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
*/
function SMSHAndler (ownerphoneNumber, storeName, storeId, Password) {
  return sendMessage(ownerphoneNumber, textMessage(storeName, storeId, ownerphoneNumber, Password))
}
function textMessage (storeName, storeId, ownerphoneNumber, Password) {
  return `your store ${storeName} /storeId ${storeId} has been registered successfully to clothx net with phone number ${ownerphoneNumber} and password ${Password}`
}
// =================================================================================================
// =================================================================================================
// ============================CORE Handler====================================================
/* function CoreHandler (storeId, email, ownerName, Password, storeName) {
  var promises = [] // promise array initaitor
  // operations as promises
  var updateStoragePAths = UpdateAbsolutePathHandler(storeId)
  var ownerphoneNumber = GetPhoneNumber(storeId)
  var encryptThePAssword = PassEncryptHandler(storeId, ownerphoneNumber, Password)
  var MAilNotification = EmailHAndler(email, ownerName, storeName, storeId, ownerphoneNumber, Password)
  var MessageNotification = SMSHAndler(ownerphoneNumber, storeName, storeId, Password)
  // END OF operation declaration
  promises.push(updateStoragePAths, ownerphoneNumber, encryptThePAssword, MAilNotification, MessageNotification)
  // piping the process and execution in array
  return Promise.all(promises) // promise chaining as array never worked in my life time
} */
function LameCoreHandler (storeId, email, ownerName, Password, storeName) {
  let ownerphoneNumber
  return UpdateAbsolutePathHandler(storeId)
    .then(() => { return GetPhoneNumber(storeId) })
    .then(doc => {
      return doc.docs.forEach(doc => {
        ownerphoneNumber = doc.id
        return PassEncryptHandler(storeId, ownerphoneNumber, Password)
          .then((encryptThePAssword) => {
            return EmailHAndler(email, ownerName, storeName, storeId, ownerphoneNumber, Password)
              .then((result) => SMSHAndler(ownerphoneNumber, storeName, storeId, Password))
          })
      })
    })
}
// ==================================================================================================
// =====================================export module================================================
module.exports = functions.firestore.document('stores/{storeId}')
  .onCreate((snap, context) => {
    var storeId, email, ownerName, Password, storeName// local variables
    [storeId, email, ownerName, Password, storeName] = ParseSnapAndContext(snap, context) // parse values
    // try { // remove this try catch if you detect anomaly (like interstellar everyone saw that coming , but no one understood it)
    // return CoreHandler(storeId, email, ownerName, Password, storeName)
    // } catch (e) { console.log(e) } // this one is useless
    return LameCoreHandler(storeId, email, ownerName, Password, storeName) // i hate this function
  })
