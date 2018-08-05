//= ===================================== IMPORTS ===============================================//
var functions = require('firebase-functions')
var dbFun = require('../CRUD/db')
var logToStoreLogistics = require('../../utils/storage/logistics/logToStorelogistics')
// ==================================MAin HANDLER ================================================ //
module.exports = functions.firestore.document('/DbIndex/stores/addstorelog/{uuid}')
  .onCreate((snap, context) => {
    return OnCreateStoreLogHandler(context.params.uuid, snap.data(), snap.data().images, snap.data().logo)
      .then((LamHandlerArgArr) => {
        console.log(...LamHandlerArgArr)
      //  return LameCoreHandler(...LamHandlerArgArr)
      })
    // try { // remove this try catch if you detect anomaly (like interstellar everyone saw that coming , but no one understood it)
    // return CoreHandler(storeId, email, ownerName, Password, storeName)
    // } catch (e) { console.log(e) } // this one is useless
    // i hate this function
  })
  // ########################### OnCreateStoreLogHandler #############################
function OnCreateStoreLogHandler (uuid, storelog, imagesFileName, logoFileName) {
  return PrepareTheData(storelog)
    .then((LamHandlerArgArr) => {
      let storedID = LamHandlerArgArr[0]
      console.log(storelog)
      return logToStoreLogistics.HandleFileMove(uuid, storedID, imagesFileName, logoFileName) // storelog data is what added in the DbIndex
    })
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
// ###################################### Preprocessor ends ####################
/*
######################################################################
######################### where trouble begins##################
*/
