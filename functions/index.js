
const admin = require('firebase-admin')
const functions = require('firebase-functions')
try { admin.initializeApp(functions.config()) } catch (e) { console.error(e) }
// ======================== firetsore triggers ======================================== //
const OncreateNewStore = require('./firestore/store/OnCreateNewStore')
const OncreateNewClothes = require('./firestore/clothes/OnCreateNewClothes')
const OndeleteClothes = require('./firestore/clothes/OnDeleteClothes')
var OnCreateNewInvoice = require('./firestore/store/OnCreateInvoice')
// +++++++++++++++++++++++++ http triggers ++++++++++++++++++++++++++++++++++++++++++++ //
const app = require('./https/Auth/Auth')
const addEmployee = require('./https/employee/addemployee')
// ------------------------- cloud function exports ----------------------------------- //
exports.OncreateNewClothes = OncreateNewClothes
exports.OndeleteClothes = OndeleteClothes
exports.Login = app
exports.Addemployee = addEmployee
exports.OnCreateNewStore = OncreateNewStore
exports.oncreatenewinvoice = OnCreateNewInvoice
