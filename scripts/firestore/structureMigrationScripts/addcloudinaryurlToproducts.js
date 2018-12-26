const firebase = require('firebase-admin')

var serviceAccountSource = require('./../../../functions/shared/environment/clothxtest-firebase-adminsdk-0bpps-e18156c08d.json') // source DB key
const firestoreAdmin = firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccountSource)
})
const firestore = firestoreAdmin.firestore()
const cloudinary = require('./../../../functions/shared/utils/integrations/cloudinary/index')
let productRef = firestore.collection('products')
firestore.runTransaction(async t => {
  let docs = await t.get(productRef)

  let promises = []
  docs.forEach((doc) => {
    let pictureUrls = doc.data().picturesUrl
    promises.push(saveToCloudinary(pictureUrls, doc.id).then((cloudinaryUrls) => t.update(doc.ref, {
      cloudinaryUrls: cloudinaryUrls
    })))
  })
  return Promise.all(promises)
})
async function saveToCloudinary (urlArray, pId) {
  let promises = []
  for (const url of urlArray) {
    let result = await cloudinary.save.product(url, pId)
    promises.push(result)
  }
  return Promise.all(promises)
}
