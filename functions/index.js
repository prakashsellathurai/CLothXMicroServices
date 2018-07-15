
const admin = require('firebase-admin')
const functions = require('firebase-functions')
try { admin.initializeApp(functions.config()) } catch (e) { console.error(e) }
// ======================== firetsore triggers ======================================== //
const OncreateNewStore = require('./firestore/store/OnCreateNewStore')
const OncreateNewClothes = require('./firestore/clothes/OnCreateNewClothes')
const OndeleteClothes = require('./firestore/clothes/OnDeleteClothes')
var OnCreateNewInvoice = require('./firestore/store/OnCreateInvoice')
// +++++++++++++++++++++++++ http triggers ++++++++++++++++++++++++++++++++++++++++++++ //
const app = require('./http/Auth/Auth')
const addEmployee = require('./http/employee/addemployee')
const addstore = require('./http/store/ADD_STORE/index')
// ------------------------- cloud function exports ----------------------------------- //
exports.login = app
exports.addemployee = addEmployee
exports.addstore = addstore
exports.OncreateNewClothes = OncreateNewClothes
exports.OndeleteClothes = OndeleteClothes
exports.OnCreateNewStore = OncreateNewStore
exports.oncreatenewinvoice = OnCreateNewInvoice
