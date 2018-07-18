var CONTANTS = require('../../environment/CONSTANTS')
var admin = require('firebase-admin')
var firestore = admin.firestore()
var storage = admin.storage().bucket(CONTANTS.STORAGE_BUCKET)
// If this  is removed the code will crash and you will die alone

module.exports = {
  updateAbsoluteFileStoragePAth: updateAbsoluteFileStoragePAth
}
function updateAbsoluteFileStoragePAth (sid) {
  return getuploadedfilePath(sid).then(uploads => {
    let logoPath = uploads.logo
    let imagesPath = uploads.images
    if (uploads.relativePath) {
      logoPath = uploads.relativePath.logo
      imagesPath = uploads.relativePath.images
    } // this is how a idiot handles a control flow
    let logoUrl = ''
    let imageUrl = []
    let promises = []
    let logoPromise = storage.file(logoPath).getMetadata().then(val => { logoUrl = UrlLifyData(val) })
    promises.push(logoPromise)
    imagesPath.forEach(image => {
      let imageRef = storage.file(image).getMetadata().then(Url => imageUrl.push(UrlLifyData(Url)))
      promises.push(imageRef)
    })
    return Promise.all(promises).then(() => {
      UpdateUrlData(sid, logoUrl, imageUrl, uploads)
    })
  })
}
function UrlLifyData (metadata) {
  return 'https://firebasestorage.googleapis.com/v0/b/' + encodeURIComponent(metadata[0].bucket) + '/o/' +
encodeURIComponent(metadata[0].name) +
'?alt=media&token=' + metadata[0].metadata.firebaseStorageDownloadTokens
}
function UpdateUrlData (sid, logoUrl, imageUrl, uploads) {
  return firestore.collection('stores').doc(`${sid}`).update({uploads: {
    absolutPath: { logo: logoUrl, images: imageUrl },
    relativePath: { logo: uploads.logo, images: uploads.images }
  }})
}
function getuploadedfilePath (sid) {
  return firestore.collection('stores').doc(`${sid}`).get().then((snap) => {
    return snap.data().uploads
  })
}
