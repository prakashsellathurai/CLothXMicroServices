//= ===================================== IMPORTS ===============================================//
const functions = require('firebase-functions')

const algolia = require('./../../../shared/utils/integrations/algolia/index')

const storeIndex = algolia.initIndex.store.unsorted
const db = require('../../../shared/firestore/CRUD/index')

const cloudinary = require('./../../../shared/utils/integrations/cloudinary/index')

async function saveToCloudinary (urlArray, storeId) {
  if (typeof urlArray === 'string') {
    if (urlArray === '') {
      return ''
    } else {
      let result = await cloudinary.save.store(urlArray, storeId)
      return result
    }
  } else {
    let promises = []
    for (const url of urlArray) {
      let result = await cloudinary.save.store(url, storeId)
      promises.push(result)
    }
    return Promise.all(promises)
  }
}

async function savecloudinaryurlToDb (snap) {
  let storePictures = checkPictureIntegrity(snap)
  let storeLogo = checkLogoIntegrity(snap)
  let storeid = snap.id
  let PicturesCloudUrlResult = await saveToCloudinary(storePictures, storeid)
  let logoCloudUrlResult = await saveToCloudinary(storeLogo, storeid)
  return db.set.cloudUrlInStore(storeid, logoCloudUrlResult, PicturesCloudUrlResult)
}
const checkPictureIntegrity = (snap) => {
  if (snap.data().hasOwnProperty('storePictures')) {
    if (snap.data().storePictures.hasOwnProperty('localDownloadUrls')) {
      return snap.data().storePictures.localDownloadUrls
    } else {
      return []
    }
  } else {
    return []
  }
}
const checkLogoIntegrity = (snap) => {
  if (snap.data().hasOwnProperty('storeLogo')) {
    if (snap.data().storeLogo.hasOwnProperty('localDownloadUrl')) {
      return snap.data().storeLogo.localDownloadUrl
    } else {
      return ''
    }
  } else {
    return ''
  }
}

function OnCreateStoreHandler (snap, context) {
  let storeId = context.params.storeId
  let registerUid = snap.data().registerUid
  return db
    .associate
    .storeInfoToUser(registerUid, storeId)
    .then(savecloudinaryurlToDb(snap))
    .then(() => {
      const data = snap.data()
      data.objectID = snap.id
      return storeIndex.addObject(data)
    })
}

// ==================================================================================================
// =====================================export module================================================
module.exports = functions
  .firestore
  .document('stores/{storeId}')
  .onCreate((snap, context) => OnCreateStoreHandler(snap, context))
