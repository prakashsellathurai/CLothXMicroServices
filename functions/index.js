var admin = require('firebase-admin')
var functions = require('firebase-functions')
var serviceAccount = require('./environment/clothxnet-firebase-adminsdk-wkk1h-a27faaab6d.json')
var CONSTANTS = require('./environment/CONSTANTS')
try {
  admin.initializeApp({
    credential : admin.credential.cert(serviceAccount),
    storageBucket: CONSTANTS.STORAGE_BUCKET
  })
} catch (e) {
  console.error(e)
}
// ======================== firetsore triggers ======================================== //
var OncreateNewStore = require('./firestore/store/OnCreateNewStore.js')
var OncreateNewStoreLog = require('./firestore/store/OnCreateAddStoreLog')
var OncreateNewClothes = require('./firestore/clothes/OnCreateNewClothes.js')
var OndeleteClothes = require('./firestore/clothes/OnDeleteClothes.js')
var OnCreateNewInvoice = require('./firestore/store/OnCreateInvoice.js')
// +++++++++++++++++++++++++ http triggers ++++++++++++++++++++++++++++++++++++++++++++ //

var addEmployee = require('./http/employee/addemployee.js')
var login = require('./http/Auth/Auth.js')
var addstore = require('./http/store/ADD_STORE/index.js')
// ------------------------- cloud function exports ----------------------------------- //

exports.OnCreateNewStoreLog = OncreateNewStoreLog
exports.OncreateNewClothes = OncreateNewClothes
exports.OndeleteClothes = OndeleteClothes
exports.OnCreateNewStore = OncreateNewStore
exports.oncreatenewinvoice = OnCreateNewInvoice
exports.login = login
exports.addemployee = addEmployee
exports.addstore = addstore
