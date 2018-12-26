const firebase = require('firebase-admin')

var serviceAccountSource = require('./../../../functions/shared/environment/clothxtest-firebase-adminsdk-0bpps-e18156c08d.json') // source DB key
const firestoreAdmin = firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccountSource)
})
const firestore = firestoreAdmin.firestore()
const cloudinary = require('./../../../functions/shared/utils/integrations/cloudinary/index')
let productRef = firestore.collection('stores')
firestore.runTransaction(async t => {
  let docs = await t.get(productRef)

  return docs
}).then((docs) => {
  let promises = []
  docs.forEach(doc => {
    promises.push(savecloudinaryurlToDb(doc))
  })
  return Promise.all(promises)
})

let refineInput = (input) => (input) || []
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
function cloudUrlInStore (storeId, logoUrl, picturesurlArray) {
  let obj = {
    storeLogo: {
      cloudinaryUrl: firebase.firestore.FieldValue.delete()
    },
    storePictures: {
      cloudinaryUrls: firebase.firestore.FieldValue.delete()
    }
  }
  return firestore
    .doc(`stores/${storeId}`)
    .set(obj, {merge: true})
}
async function savecloudinaryurlToDb (snap) {
  let storePictures = checkPictureIntegrity(snap)
  let storeLogo = checkLogoIntegrity(snap)
  let storeid = snap.id
  try {
    let PicturesCloudUrl = await saveToCloudinary(storePictures, storeid)
    let logoCloudUrl = await saveToCloudinary(storeLogo, storeid)
    return cloudUrlInStore(snap.id, logoCloudUrl, PicturesCloudUrl)
  } catch (e) {
    return Promise.resolve(e)
  }
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
