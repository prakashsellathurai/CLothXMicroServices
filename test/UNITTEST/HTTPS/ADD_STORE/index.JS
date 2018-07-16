const express = require('express')
const app = express()
const path = require('path')
const Busboy = require('busboy')
const PORT = 3000
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
app.use(express.static(path.join(__dirname, 'public')))
var firestore = admin.firestore()
var bucket = gcloud.bucket('clothxnet.appspot.com')
// #########################################################################3
app.get('', express.static(path.join(__dirname, 'public')))
app.get('/', express.static(path.join(__dirname, 'public')))
app.use('/success', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/success.html'))
})
app.post('/submit', (req, res) => {
  const uuid = makeid()
  var storeObj = {}
  var busboy = new Busboy({ headers: req.headers })
  busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
    var location = `logs/AddStoreLogs/${uuid}/${fieldname}/${filename}`
    addUpload(storeObj, `${fieldname}`, location)
    var fileStream = bucket.file(location).createWriteStream()
    //   var addstorelogRef = storageRef.child(`addstorelog/${uuid}/${filename}`)
    file.on('data', function (data) {
      fileStream.write(data)
    })
    file.on('end', function () {
      fileStream.end()
    })
  })
  busboy.on('field', function (
    fieldname,
    val,
    fieldnameTruncated,
    valTruncated,
    encoding,
    mimetype
  ) {
    storeObj[fieldname] = val
  })
  busboy.on('finish', function () {
    return addstorelog(uuid, storeObj).then(ref => {
      console.log(storeObj)
      
   res.redirect('/success')
      res.end()
    })
  })
  if (req.rawBody) {
    busboy.end(req.rawBody);
}
else {
    req.pipe(busboy);
}
 
})

app.listen(PORT, console.log('listening on PORT ' + PORT))
function makeid () {
  var text = ''
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (var i = 0; i < 10; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}
function addstorelog (uuid, doc) {
  return firestore
    .collection('/DbIndex/stores/addstorelog')
    .doc(uuid)
    .set(RemoveUndefinedValues(doc))
}
function RemoveUndefinedValues (obj) {
  return JSON.parse(JSON.stringify(obj))
}
function addUpload (obj, key, value) {
  if (!obj.hasOwnProperty(key)) {
    obj[key] = []
  }
  if (!Array.isArray(obj[key])) {
    obj[key] = [obj[key]]
  }
  obj[key].push(value)
}
