// ##################################################################
var admin = require('firebase-admin')
var serviceAccount = require('./../../../../functions/environment/clothxnet-firebase-adminsdk-wkk1h-a27faaab6d.json')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://clothxnet.firebaseio.com'
})
var db = require('../../../../functions/firestore/CRUD/db')
db.GetUserData('w2DUjxHxBIQCuYg4LB0ZlALpD7r2').then(data => console.log(data))