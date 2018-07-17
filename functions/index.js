
var admin = require('firebase-admin')
var functions = require('firebase-functions')
try { admin.initializeApp(functions.config()) } catch (e) { console.error(e) }
// ======================== firetsore triggers ======================================== //
var OncreateNewStore = require('./firestore/store/OnCreateNewStore')
var OncreateNewClothes = require('./firestore/clothes/OnCreateNewClothes')
var OndeleteClothes = require('./firestore/clothes/OnDeleteClothes')
var OnCreateNewInvoice = require('./firestore/store/OnCreateInvoice')
// +++++++++++++++++++++++++ http triggers ++++++++++++++++++++++++++++++++++++++++++++ //

var addEmployee = require('./http/employee/addemployee')
var app = require('./http/Auth/Auth')
var addstore = require('./http/store/ADD_STORE/index')
// ------------------------- cloud function exports ----------------------------------- //

exports.OncreateNewClothes = OncreateNewClothes
exports.OndeleteClothes = OndeleteClothes
exports.OnCreateNewStore = OncreateNewStore
exports.oncreatenewinvoice = OnCreateNewInvoice
exports.login = app
exports.addemployee = addEmployee
exports.addstore = addstore
