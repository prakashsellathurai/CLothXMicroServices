var admin = require('firebase-admin')
var env = require('../../../../functions/environment/env')
var serviceAccount = require('./../../../../functions/environment/clothxnet-firebase-adminsdk-wkk1h-a27faaab6d.json')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://clothxnet.firebaseio.com'
})
var storage = admin.storage().bucket(env.STORAGE_BUCKET)
var firestore = admin.firestore()
var env = require('../../../../functions/environment/env')
function updateAbsoluteFileStoragePAth (sid) {
  return getuploadedfilePath(sid).then(uploads => {
    let logoPath = uploads.relativePath.logo
    let imagesPath = uploads.relativePath.images
    let logoUrl = []
    let imageUrl = []
    let promises = []
    if (isUndefined(logoPath) && isUndefined(imagesPath)) {
      console.log('imagePath and logopath are undefined')
      return Promise.resolve()
    } else {
      let logoPromises = logoPromiseHandler(logoPath).then(url => logoUrl = url.slice())
      let imagePromises = imagePromiseHandler(imagesPath).then(url => imageUrl= url.slice())
      return logoPromises
            .then(() => imagePromises)
            .then(() => UpdateUrlData(sid, logoUrl, imageUrl, uploads))      // return PromiseChainHandler(promises, sid, logoUrl, imageUrl, uploads)
            .catch((err) => console.log('promise chain error' +err))     }
  })
}
function imagePromiseHandler (imagesPath) {
  let promises = []
  if (Array.isArray(imagesPath)) imagesPath.forEach(image => promises.push(GetSignedUrl(image)))
  else promises.push(GetSignedUrl(imagesPath))
  return Promise.all(promises)
}
function logoPromiseHandler (logoPath) {
  let promises = []
  if (Array.isArray(logoPath)) logoPath.forEach(logo => promises.push(GetSignedUrl(logo)))
  else  promises.push(GetSignedUrl(logoPath))
  return Promise.all(promises)
}

function UpdateUrlData (sid, logoUrl, imageUrl, uploads) {
  return firestore
  .collection('stores')
  .doc(`${sid}`)
  .update({
    uploads: {
      absolutPath: { logo: logoUrl, images: imageUrl },
      relativePath: { logo: uploads.relativePath.logo, images: uploads.relativePath.images }
    }
  }).then(() => console.log('updated successfully')).catch(err => console.log('updateurlData Eroor' + err))
}
function getuploadedfilePath (sid) {
  return firestore
    .collection('stores')
    .doc(`${sid}`)
    .get()
    .then(snap => snap.data().uploads)
}
function GetSignedUrl (FileLocation) {
  return storage
    .file(FileLocation)
    .getSignedUrl(env.GET_SIGNED_URL_SETTINGS)
    .then(signedUrls => signedUrls[0])
    .catch(err => console.log('get signed url error' + 'Error Info ' + err))
}
function isUndefined (obj) {
  return typeof obj === 'undefined' || obj === undefined || obj === null
}
updateAbsoluteFileStoragePAth(1034)
