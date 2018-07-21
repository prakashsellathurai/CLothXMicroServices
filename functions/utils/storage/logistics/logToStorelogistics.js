var CONTANTS = require('../../../environment/CONSTANTS')
var admin = require('firebase-admin')
var firestore = admin.firestore()
var storage = admin.storage().bucket(CONTANTS.STORAGE_BUCKET)
function LogToSTorePort (oldlocation, newlocation) {
    const 
}