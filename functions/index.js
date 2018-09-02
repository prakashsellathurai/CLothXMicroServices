'use strict'
/* // ========================Intialize Admin SDk with credentials =======================//
var InitAdmin = require('./environment/initAdmin')
InitAdmin.CredentialsForProduction()
// ======================== firetsore triggers ======================================== //
var OncreateNewStore = require('./firestore/store/OnCreateNewStore.js')
var OncreateNewClothes = require('./firestore/clothes/OnCreateNewClothes.js')
var OndeleteClothes = require('./firestore/clothes/OnDeleteClothes.js')
var OnCreateNewInvoice = require('./firestore/store/OnCreateInvoice.js')
// +++++++++++++++++++++++++ http triggers ++++++++++++++++++++++++++++++++++++++++++++ //

var addEmployee = require('./http/employee/addemployee.js')
var login = require('./http/Auth/Auth.js')
var addstore = require('./http/store/ADD_STORE/index.js')
// ------------------------- cloud function exports ----------------------------------- //
exports.OncreateNewClothes = OncreateNewClothes
exports.OndeleteClothes = OndeleteClothes
exports.OnCreateNewStore = OncreateNewStore
exports.oncreatenewinvoice = OnCreateNewInvoice
exports.login = login
exports.addemployee = addEmployee
exports.addstore = addstore
*/

function exportFunction () {
  const glob = require('glob')
  const path = require('path')
  const EXPORTS_FOLDER = path.join(__dirname, '/exports')
  return glob.sync('{,!(node_modules)/**/}*.js', { cwd: EXPORTS_FOLDER }).forEach(file => {
    const only = process.env.FUNCTION_NAME
    const name = concoctFunctionName(file)
    if (only === undefined || only === name) {
      console.log(name + '' + 'file: ' + file)
    }
  })
}

function concoctFunctionName (file) {
  const camel = require('camelcase')
  const split = file.split('/')
  const event = split.pop().split('.')[0]
  const snake = `${split.join('_')}${event}`
  return camel(snake)
}
exportFunction()
