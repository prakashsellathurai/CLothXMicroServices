// ##################################################################
var admin = require('firebase-admin')
var gcloud = require('@google-cloud/storage')({
  projectId: 'clothxnet',
  keyFilename: './../../../../functions/environment/clothxnet-firebase-adminsdk-wkk1h-a27faaab6d.json'
})
var serviceAccount = require('./../../../../functions/environment/clothxnet-firebase-adminsdk-wkk1h-a27faaab6d.json')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://clothxnet.firebaseio.com'
})
var db = require('../../../../functions/firestore/CRUD/db')
db.getStoreData(10009).then(val => console.log(val))
