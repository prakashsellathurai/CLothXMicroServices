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
var firestore = admin.firestore()
const readline = require('readline')
const stream = require('stream');
var bucket = gcloud.bucket('clothxnet.appspot.com')
function HandleFilemove (oldlocatoion, newlocation) {
  var oldFile = bucket.file(oldlocatoion)
  var newfile = bucket.file(newlocation)
  var readFile = oldFile.createReadStream()
  var writFile = newfile.createResumableUpload()
  readFile.pipe(writFile)
}
HandleFilemove('/log', '/newlocation')
