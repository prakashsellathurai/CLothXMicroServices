const firebase = require('firebase-admin')
const url = require('url')
var serviceAccountSource = require('./../functions/shared/environment/clothxnet-firebase-adminsdk-wkk1h-a27faaab6d.json') // source DB key
var serviceAccountDestination = require('./../functions/shared/environment/clothxtest-firebase-adminsdk-0bpps-e18156c08d.json') // destiny DB key

const sourceAdmin = firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccountSource)
})

const destinationAdmin = firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccountDestination)
}, 'destination')
const storageSchema = {
  stores: {

  }
}

var source = sourceAdmin.storage().bucket('gs://clothxnet.appspot.com')
var destination = destinationAdmin.storage().bucket('gs://clothxtest.appspot.com')
const copyStorage = (source, destination, aux) => {
  let signedUrlConfig = { action: 'read', expires: '03-17-2025' }
  let fileURLs = []
  return Promise
    .all(Object.keys(aux).map((dir) => {
      return source
        .getFiles()
        .then(files => {
          let promises = []
          files
            .forEach(fileobjects => {
              fileobjects
                .forEach(file => {
                //  let sourceRef = source.file(`${file.name}`)
                  // console.log(sourceRef)
                  let filereadstream = source.file(file.name).createReadStream()
                  let fileWritestream = destination.file(file.name).createWriteStream()
                  filereadstream.pipe(fileWritestream)
                })
            })
        })
    }))
}
copyStorage(source, destination, storageSchema)
  .then((files) => console.log('copied'))
