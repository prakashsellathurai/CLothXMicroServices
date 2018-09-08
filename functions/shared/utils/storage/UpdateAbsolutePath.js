var CONSTANTS = require('../../environment/CONSTANTS')
var admin = require('firebase-admin')
var firestore = admin.firestore()
var storage = admin.storage().bucket(CONSTANTS.STORAGE_BUCKET)
// If this  is removed the code will crash and you will die alone

module.exports = {
  updateAbsoluteFileStoragePAth: updateAbsoluteFileStoragePAth
}
function updateAbsoluteFileStoragePAth (sid) {
  return getuploadedfilePath(sid).then(uploads => {
    let logoPath = uploads.relativePath.logo
    let imagesPath = uploads.relativePath.images
    let logoUrl = []
    let imageUrl = []
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
    .getSignedUrl(CONSTANTS.GET_SIGNED_URL_SETTINGS)
    .then(signedUrls => signedUrls[0])
    .catch(err => console.log('get signed url error' + 'Error Info ' + err))
}
function isUndefined (obj) {
  return typeof obj === 'undefined' || obj === undefined || obj === null
}
