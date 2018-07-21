//= ===================================== IMPORTS ===============================================//
var functions = require('firebase-functions')
var dbFun = require('../CRUD/db')
var sendEmail = require('../../utils/Mail/sendmail')
var sendMessage = require('../../utils/message/SendMessage')
var UpdateAbsolutePathHandler = require('../../utils/storage/UpdateAbsolutePath')
var generalUtils = require('../../utils/cryptographicFunctions/general')
var logToStoreLogistics = require('../../utils/storage/logistics/logToStorelogistics')
// ==================================MAin HANDLER ================================================ //
module.exports = functions.firestore.document('/DbIndex/stores/addstorelog/{uuid}')
  .onCreate((snap, context) => {
    var uuid, storelog// local variables
    [uuid, storelog] = ParseSnapAndContext(snap, context) // parse values
    return Preprocessor(uuid, storelog)
      .then((LamHandlerArgArr) => {
        console.log(...LamHandlerArgArr)
        return LameCoreHandler(...LamHandlerArgArr)
      })
    // try { // remove this try catch if you detect anomaly (like interstellar everyone saw that coming , but no one understood it)
    // return CoreHandler(storeId, email, ownerName, Password, storeName)
    // } catch (e) { console.log(e) } // this one is useless
    // i hate this function
  })
  // ########################### preprocessor #############################
function Preprocessor (uuid, storelog) {
  return PrepareTheData(storelog)
    .then((LamHandlerArgArr) => {
      let storedID = LamHandlerArgArr[0]
      return logToStoreLogistics.HandleFileMove(uuid, `${storedID}`, `${storelog.images}`, `${storelog.logo}`) // storelog data is what added in the DbIndex
        .then(() => LamHandlerArgArr) // they are location from log data)
    })
}
function ParseSnapAndContext (snap, context) {
  return [context.params.uuid, snap.data()]
}
function PrepareTheData (storelog) {
  return dbFun.createStoreByStoreLog(storelog)
    .then(storedID => {
      return dbFun.getStoreData(storedID)
        .then((storeData) => extractTheProcessingData(storedID, storeData))
    })
}
function extractTheProcessingData (storedID, storeData) {
  return [storedID, storeData.email, storeData.ownerName, storeData.storeName, storeData.ownerMobileNo]
}
function HandleFilemove (uuid, storedID) {
  return storedID
}

// ###################################### Preprocessor ends ####################
/*
######################################################################
######################### where trouble begins##################
*/
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
    var updateStoragePAths = UpdateAbsolutePathHandler.updateAbsoluteFileStoragePAth(storeId)
    var ownerphoneNumber = GetPhoneNumber(storeId)
    var encryptThePAssword = PassEncryptHandler(storeId, ownerphoneNumber, Password)
    var MAilNotification = EmailHAndler(email, ownerName, storeName, storeId, ownerphoneNumber, Password)
    var MessageNotification = SMSHAndler(ownerphoneNumber, storeName, storeId, Password)
    // END OF operation declaration
    promises.push(updateStoragePAths, ownerphoneNumber, encryptThePAssword, MAilNotification, MessageNotification)
    // piping the process and execution in array
    return Promise.all(promises) // promise chaining as array never worked in my life time
  } */
function LameCoreHandler (storeId, email, ownerName, storeName, ownerMobileNo) {
  let Password = generalUtils.PasswordGenerator(6)
  return UpdateAbsolutePathHandler.updateAbsoluteFileStoragePAth(storeId)
    .then(() => { return GetPhoneNumber(storeId) })
    .then(doc => {
      return doc.docs.forEach(doc => {
        return PassEncryptHandler(storeId, ownerMobileNo, Password)
          .then((encryptThePAssword) => {
            return EmailHAndler(email, ownerName, storeName, storeId, ownerMobileNo, Password)
              .then((result) => SMSHAndler(ownerMobileNo, storeName, storeId, Password))
          })
      })
    })
}