const functions = require('firebase-functions')
const express = require('express')
const addstore = express()
const path = require('path')
const Busboy = require('busboy')
const compression = require('compression')
const cors = require('cors')
const helmet = require('helmet')

// debug
const os = require('os')
const fs = require('fs')
const tmpdir = os.tmpdir()

// custom
var uploadedFiles = []

const dbFun = require('../../../firestore/CRUD/db')
// ##################################################################
const gcloud = require('@google-cloud/storage')(
  { projectId: 'clothxnet' }
)
const bucket = gcloud.bucket('clothxnet.appspot.com')
// #########################################################################3
// Automatically allow cross-origin requests
addstore.use(cors({ origin: true }))
// allow gzip compression
addstore.use(compression())
// use helmet for safety
addstore.use(helmet())
addstore.use(express.static(path.join(__dirname, 'public')))
addstore.get('/', express.static(path.join(__dirname, 'public')))
addstore.get('/success', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/success.html'))
)
addstore.post('/submit', (req, res) => SubmitHandler(req, res))

addstore.post('/mocktest', (req, res) => mockHAndler(req, res))
module.exports = functions.https.onRequest(addstore)
// ######################################################################################
function SubmitHandler (req, res) {
  const uuid = makeid()
  var storeObj = {}
  const uploads = {}
  var busboy = new Busboy({ headers: req.headers })
  busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
    var location = `logs/addstore/${uuid}/${fieldname}/${filename}`
    addUpload(storeObj, `${fieldname}`, `${filename}`)
    // Note: os.tmpdir() points to an in-memory file system on GCF
    // Thus, any files in it must fit in the instance's memory.
    console.log(`Processed file ${filename}`)
    const filepath = path.join(tmpdir, filename)
    uploads[fieldname] = filepath
    var fileStream = bucket.file(location).createWriteStream()
    uploadedFiles.push(location)
    // file.pipe(fs.createWriteStream(filepath))
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
    /* for (const name in uploads) {
      const file = uploads[name]
      // fs.unlinkSync(file)
    } */
    storeObj[uuid] = uuid
    return dbFun.addstorelog(uuid, storeObj).then(ref => {
      res.redirect('/addstore/success')
    })
  })
  if (req.rawBody) {
    busboy.end(req.rawBody)
  } else {
    req.pipe(busboy)
  }
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
