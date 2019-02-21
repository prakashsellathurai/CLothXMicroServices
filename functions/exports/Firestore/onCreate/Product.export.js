// ======================================= IMPORTS ===============================================//
const db = require('./../../../shared/firestore/CRUD/index')
const functions = require('firebase-functions')
const algolia = require('./../../../shared/utils/integrations/algolia/index')
const cloudinary = require('./../../../shared/utils/integrations/cloudinary/index')
const _ = require('lodash')

function ObjectIdAssigner (context, cloudinaryUrl) {
  let productId = context.params.productId
  return db.set.RandomObjectIdToProduct(productId, cloudinaryUrl)
}
async function saveToCloudinary (urlArray, productId) {
  let promises = []
  for (const url of urlArray) {
    let result = await cloudinary.save.product(url, productId)
    promises.push(result)
  }
  return Promise.all(promises)
}
function IndexItInAlgolia (data) {
  return algolia.save.product(data)
}

async function MainHandler (snap, context) {
  let urlArray = _.get(snap.data(), 'pictures.url')
  let cloudinaryUrl = await saveToCloudinary(urlArray, snap.id)
  let data = await ObjectIdAssigner(context, cloudinaryUrl)

  return IndexItInAlgolia(data)
}

// ==================================================================================================
// =====================================export module================================================
module.exports = functions
  .firestore
  .document('/products/{productId}')
  .onCreate((snap, context) => MainHandler(snap, context))
