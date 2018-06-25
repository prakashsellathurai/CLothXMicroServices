
var admin = require('firebase-admin')
var functions = require('firebase-functions')
try { admin.initializeApp(functions.config()) } catch (e) { console.error(e) }

var OncreateNewClothes = require('./firestore/clothes/OnCreateNewClothes')
var OndeleteClothes = require('./firestore/clothes/OnDeleteClothes')
var app = require('./Auth/Auth')
var addEmployee = require('./firestore/store/employee/addemployee')
var OncreateNewStore = require('./firestore/store/OnCreateNewStore')


exports.oncreatenewclothes = OncreateNewClothes
exports.ondeleteclothes = OndeleteClothes
exports.login = app
exports.addemployee = addEmployee
exports.oncreatenewstore = OncreateNewStore

