let admin = require('firebase-admin')
let firestore = admin.firestore()
let update = require('./update')
let utils = require('./../utils/index')

function invoicePendingStatusToFalse (invoiceId) {
  return update.invoicePendingStatus(invoiceId, 'false')
}
function cloudUrlInStore (storeId, logoUrlResult, picturesurlArrayResult) {
  let obj = {
    storeLogo: {
      cloudinary: logoUrlResult
    },
    storePictures: {
      cloudinary: picturesurlArrayResult
    }
  }
  return firestore
    .doc(`stores/${storeId}`)
    .set(obj, {merge: true})
}

function productPRN (productId, PRN_VALUE) {
  return firestore
    .doc(`/products/${productId}`)
    .set({
      prn: PRN_VALUE,
      createdOn: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true })
}
function objectIDtoProduct (productId, variants) {
  return firestore
    .doc(`/products/${productId}`)
    .set({
      variants: variants
    }, {
      merge: true
    })
}

function RandomObjectIdToProduct (productId, cloudinaryUrl) {
  let productDocRef = firestore
    .doc(`/products/${productId}`)
  return firestore
    .runTransaction(t => {
      return t.get(productDocRef)
        .then((doc) => {
          let data = doc.data()
          let productUid = doc.id
          let variants = data.variants
          for (let index = 0; index < variants.length; index++) {
            variants[index].objectID = productUid + '_' + index
          }
          return utils.prnCheckLoop()
            .then((prn) => {
              t.update(doc.ref, {
                prn: prn,
                variants: variants,
                cloudinaryUrl: cloudinaryUrl,
                createdOn: admin.firestore.FieldValue.serverTimestamp()
              })
              data.prn = prn
              data.variants = variants
              return data
            })
        })
    })
}
module.exports = {
  invoicePendingStatusToFalse: invoicePendingStatusToFalse,
  productPRN: productPRN,
  objectIDtoProduct: objectIDtoProduct,
  RandomObjectIdToProduct: RandomObjectIdToProduct,
  cloudUrlInStore: cloudUrlInStore
}
