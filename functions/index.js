'use strict'
// firebase imports
const admin = require('firebase-admin')
try { admin.initializeApp() } catch (e) { }

// export function handlers
const onCreateUserHandler = require('./Handlers/OnCreateNewUserHandler')
const OnCreateNewShopHandler = require('./Handlers/OnCreateNewShopHandler')
const OnCreateNewClothHandler = require('./Handlers/OnCreateNewClothHandler')

// exports for cloud functions
exports.OnCreateNewShop = OnCreateNewShopHandler()
exports.OnCreateNewUser = onCreateUserHandler()
exports.OnCreateNewCloths = OnCreateNewClothHandler()
