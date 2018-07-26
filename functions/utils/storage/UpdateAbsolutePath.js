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
    let logoUrl = ''
    let imageUrl = []
    let promises = []
    console.log('logo' + logoPath + 'images' + imagesPath)
    if (typeof logoPath === 'undefined' && typeof imagesPath === 'undefined') {
      console.log('imagePath and logopath are undefined')
      return Promise.resolve()
    } else {
      logoPath.forEach(logo => {
        let logoPromise = storage
          .file(logo)
          .getSignedUrl(CONSTANTS.GET_SIGNED_URL_SETTINGS)
          .then(signedUrls => { logoUrl = signedUrls[0]; return 0 })
          .catch(err => console.log('get signed url error' + 'Error Info ' + err))
        promises.push(logoPromise)
      })
      imagesPath.forEach(image => {
        let imageRef = storage
          .file(image)
          .getSignedUrl(CONSTANTS.GET_SIGNED_URL_SETTINGS)
          .then(signedUrls => imageUrl.push(signedUrls[0]))
          .catch(err => console.log('get signed url error' + 'Error Info ' + err))
        promises.push(imageRef)
      })
      return Promise.all(promises).then(() =>
        UpdateUrlData(sid, logoUrl, imageUrl, uploads)
      )
    }
  })
}

function UpdateUrlData (sid, logoUrl, imageUrl, uploads) {
  return firestore
    .collection('stores')
    .doc(`${sid}`)
    .update({
      uploads: {
        absolutPath: { logo: logoUrl, images: imageUrl },
        relativePath: { logo: uploads.logo, images: uploads.images }
      }
    })
}
function getuploadedfilePath (sid) {
  return firestore
    .collection('stores')
    .doc(`${sid}`)
    .get()
    .then(snap => snap.data().uploads)
}
