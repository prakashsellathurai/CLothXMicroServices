const functions = require('firebase-functions')
const algolia = require('./../../../shared/utils/integrations/algolia/index')
const storeIndex = algolia.initIndex.store.unsorted

const _ = require('lodash')
const cloudinary = require('./../../../shared/utils/integrations/cloudinary/index')
const db = require('../../../shared/firestore/CRUD/index')

module.exports = functions
  .firestore
  .document('stores/{storeId}')
  .onUpdate(async (change, context) => {
    const document = change.after.data()
    const dataForalgolia = document
    dataForalgolia.objectID = context.params.storeId
    const oldDocument = change.before.data()
    const storeId = context.params.storeId

    let saveObject = await addToAlgolia(storeIndex, dataForalgolia)
    let logo = await StorePicturesSync(document, oldDocument, storeId)
    let pictures = await LogoImagesync(document, oldDocument, storeId)

    return Promise.all([
      saveObject,
      logo,
      pictures
    ])
  })
function addToAlgolia (storeIndex, dataForalgolia) {
  return storeIndex.saveObject(dataForalgolia)
}
async function StorePicturesSync (document, oldDocument, storeId) {
  if (checkNested(document, 'storePictures', 'localDownloadUrls')) {
    let localDownloadUrls = document.storePictures.localDownloadUrls
    let oldLocalDownloadurls = checkNested(oldDocument, 'storePictures', 'localDownloadUrls') ? oldDocument.storePictures.localDownloadUrls : []

    if (isArrayEqual(localDownloadUrls, oldLocalDownloadurls)) {
      console.log('storePictures not modified')
      return false
    } else {
      if (_.isArray(localDownloadUrls)) {
        if (checkNested(document, 'storePictures', 'cloudinary')) {
          let cloudinary = document.storePictures.cloudinary
          if (cloudinary.length === localDownloadUrls.length) {
            return updatePictures(cloudinary, localDownloadUrls)
            // edit it
          } else if (localDownloadUrls.length === 0) {
            // delete it
            return false
          } else {
            let cloudinaryResults = await savepictures(localDownloadUrls, storeId)
            let obj = {}
            obj['storePictures.cloudinary'] = cloudinaryResults
            return db.update.store(storeId, obj)
            // create in cloudinary
          }
        } else {
          let cloudinaryResults = await savepictures(localDownloadUrls, storeId)
          let obj = {}
          obj['storePictures.cloudinary'] = cloudinaryResults
          return db.update.store(storeId, obj)
          // create it
        }
      }
    }
  } else {
    return false
  }
}
async function LogoImagesync (document, oldDocument, storeId) {
  if (checkNested(document, 'storeLogo', 'localDownloadUrl')) {
    let localDownloadUrl = document.storeLogo.localDownloadUrl
    let oldLocalDownloadurl = checkNested(oldDocument, 'storeLogo', 'localDownloadUrl') ? oldDocument.storeLogo.localDownloadUrl : ''

    if (_.isEqual(localDownloadUrl, oldLocalDownloadurl)) {
      console.log('storeLogo not modified')
      return false
    } else {
      if (checkNested(document, 'storeLogo', 'cloudinary')) {
        if (document.storeLogo.cloudinary === '') {
          let result = await cloudinary.save.store.logo(localDownloadUrl, storeId)
          let obj = {}
          obj['storeLogo.cloudinary'] = result
          return db.update.store(storeId, obj)
          // create in cloudinary
        } else if (document.storeLogo.localDownloadUrl === '') {
          // delete it
          return false
        } else if (checkNested(document, 'cloudinary', 'public_id')) {
          let publicId = document.cloudinary.public_id
          return cloudinary.update.image(localDownloadUrl, publicId)
          // edit it
        } else {
          return false
        }
      } else {
        let result = await cloudinary.save.store.logo(localDownloadUrl, storeId)
        let obj = {}
        obj['storeLogo.cloudinary'] = result
        return db.update.store(storeId, obj)
        // create it
      }
    }
  }
  return false
}
function checkNested (obj /*, level1, level2, ... levelN */) {
  for (var i = 1; i < arguments.length; i++) {
    if (!obj.hasOwnProperty(arguments[i])) {
      return false
    }
    obj = obj[arguments[i]]
  }
  return true
}
var isArrayEqual = (x, y) => _(x).xorWith(y, _.isEqual).isEmpty()
async function savepictures (picturesArray, storeId) {
  let promises = []
  for (const picture of picturesArray) {
    let result = await cloudinary.save.store.Pictures(picture, storeId)
    promises.push(result)
  }
  return Promise.all(promises)
}
async function updatePictures (cloudinaryArray, localDownloadUrls) {
  let promises = []
  for (let index = 0; index < cloudinaryArray.length; index++) {
    const cloudinaryObj = cloudinaryArray[index]
    if (!checkNested(cloudinaryObj, 'public_id')) {
      let result = await cloudinary.update.image(localDownloadUrls[index], cloudinaryObj.public_id)
      promises.push(result)
    }
  }
  return Promise.all(promises)
}
