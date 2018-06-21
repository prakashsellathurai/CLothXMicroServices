
var admin = require('firebase-admin')
var functions = require('firebase-functions')
try { admin.initializeApp(functions.config()) } catch (e) { console.error(e) }

var OncreateNewClothes = require('./firestore/clothes/OnCreateNewClothes')
var OndeleteClothes = require('./firestore/clothes/OnDeleteClothes')
var app = require('./Auth/Auth')
var addEmployee = require('./firestore/store/addemployee')
var OnAddStore = require('./firestore/store/addemployee')
exports.OncreateNewClothes = OncreateNewClothes
exports.OndeleteClothes = OndeleteClothes
exports.Login = app
exports.Addemployee = addEmployee
exports.OnCreateStore = OnAddStore
