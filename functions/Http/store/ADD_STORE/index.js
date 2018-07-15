const functions = require('firebase-functions')
const express = require('express')
const app = express()
const path = require('path')
const Busboy = require('busboy')
const compression = require('compression')
const cors = require('cors')
const helmet = require('helmet')

const dbFun = require('../../../firestore/CRUD/db')
// ##################################################################
const gcloud = require('@google-cloud/storage')({
  projectId: 'clothxnet',
  keyFilename: './../../../../functions/environment/clothxnet-firebase-adminsdk-wkk1h-a27faaab6d.json'
})
const bucket = gcloud.bucket('clothxnet.appspot.com')
// #########################################################################3
// Automatically allow cross-origin requests
app.use(cors({ origin: true }))
// allow gzip compression
app.use(compression())
// use helmet for safety
app.use(helmet())

app.get('/', express.static(path.join(__dirname, 'public')))
app.get('/success', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/success.html'))
)
app.post('/submit', (req, res) => SubmitHandler(req, res))

module.exports = functions.https.onRequest(app)
// ######################################################################################
function SubmitHandler (req, res) {
  const uuid = makeid()
  var storeObj = {}
  var busboy = new Busboy({ headers: req.headers })
  busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
    var location = `logs/AddStoreLogs/${uuid}/${fieldname}/${filename}`
    addUpload(storeObj, `${fieldname}`, location)
    var fileStream = bucket.file(location).createWriteStream()
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
    return dbFun.addstorelog(uuid, storeObj).then(ref => {
      console.log(storeObj)
      res.redirect('/success')
      res.end()
    })
  })
  req.pipe(busboy)
}
function makeid () {
  var text = ''
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (var i = 0; i < 10; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
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
