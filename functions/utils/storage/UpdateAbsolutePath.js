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
    let logoPath = (typeof uploads.logo !== 'undefined') ? uploads.logo : (typeof uploads.relativePath.logo !== 'undefined') ? uploads.relativePath.logo : undefined
    let imagesPath = (typeof uploads.!== 'undefined') ? uploads.images : (typeof uploads.relativePath.images!== 'undefined') ? uploads.relativePath.images : undefined
    let logoUrl = ''
    let imageUrl = []
    let promises = []
    if (typeof logoPath === 'undefined' && typeof imagesPath === 'undefined') {
      console.log('imagePath and logopath are undefined')
      return Promise.resolve()
    } else {
      let logoPromise = storage.file(logoPath).getMetadata().then(val => { logoUrl = UrlLifyData(val) })
      promises.push(logoPromise)
      imagesPath.forEach(image => {
        let imageRef = storage.file(image).getMetadata().then(Url => imageUrl.push(UrlLifyData(Url)))
        promises.push(imageRef)
      })
      return Promise.all(promises).then(() => UpdateUrlData(sid, logoUrl, imageUrl, uploads))
    }
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
