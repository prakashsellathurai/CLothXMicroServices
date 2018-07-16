const functions = require('firebase-functions')
const express = require('express')
const app = express()
const path = require('path')
const Busboy = require('busboy')
const compression = require('compression')
const cors = require('cors')
const helmet = require('helmet')

// debug
const os = require('os')
const fs = require('fs')

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
app.use(express.static(path.join(__dirname, 'public')))
app.get('/', express.static(path.join(__dirname, 'public')))
app.get('/success', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/success.html'))
)
app.post('/submit', (req, res) => SubmitHandler(req, res))

app.post('/mocktest', (req, res) => mockHAndler(req, res))
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
    console.log(req.rawBody)
    return dbFun.addstorelog(uuid, storeObj).then(ref => {
      console.log(storeObj)
      res.redirect('/addstore/success')
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
// ########################################################################### mock hanlder for debugging ###################################
function mockHAndler (req, res) {
  if (req.method === 'POST') {
    const busboy = new Busboy({ headers: req.headers })
    const tmpdir = os.tmpdir()

    // This object will accumulate all the fields, keyed by their name
    const fields = {}

    // This object will accumulate all the uploaded files, keyed by their name.
    const uploads = {}

    // This code will process each non-file field in the form.
    busboy.on('field', (fieldname, val) => {
      // TODO(developer): Process submitted field values here
      console.log(`Processed field ${fieldname}: ${val}.`)
      fields[fieldname] = val
    })

    // This code will process each file uploaded.
    busboy.on('file', (fieldname, file, filename) => {
      // Note: os.tmpdir() points to an in-memory file system on GCF
      // Thus, any files in it must fit in the instance's memory.
      console.log(`Processed file ${filename}`)
      const filepath = path.join(tmpdir, filename)
      uploads[fieldname] = filepath
      file.pipe(fs.createWriteStream(filepath))
    })

    // This event will be triggered after all uploaded files are saved.
    busboy.on('finish', () => {
      // TODO(developer): Process uploaded files here
      for (const name in uploads) {
        const file = uploads[name]
        fs.unlinkSync(file)
      }
      res.send()
    })

    req.pipe(busboy)
  } else {
    // Return a "method not allowed" error
    res.status(405).end()
  }
}
