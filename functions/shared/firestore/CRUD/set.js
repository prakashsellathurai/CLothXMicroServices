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
    .set(obj, { merge: true })
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
          let objectID = generateObjectId(productUid)
          t.update(doc.ref, {
            objectID: objectID,
            cloudinaryUrl: cloudinaryUrl,
            createdOn: admin.firestore.FieldValue.serverTimestamp()
          })
          data.objectID = objectID
          data.cloudinaryUrl = cloudinaryUrl
          return data
        })
    })
}
const multipleProducts = async (productsInJson) => {
  let groupId = ''
  for (const i in productsInJson) {
    await firestore.collection(`products`)
      .add(productsInJson[i])
      .then((docRef) =>
        multipleProductsHandlerRoutine(docRef, productsInJson[i].storeId, groupId)
      )
  }
}
function multipleProductsHandlerRoutine (docRef, storeId, groupId) {
  let prn = ''
  const possible = 'bcdfghjklmnpqrstvwxyz'

  for (let i = 0; i < 4; i++) {
    prn += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return firestore.collection('products')
    .where(storeId, '==', `${storeId}`)
    .where(prn, '==', `${prn}`)
    .get()
    .then((data) => {
      if (data.size === 0) {
        return firestore
          .runTransaction((t) =>
            t
              .get(docRef)
              .then(() => {
                t
                  .update(docRef,
                    {
                      productUid: docRef.id,
                      prn: prn,
                      groupId: groupId === '' ? prn : groupId,
                      createdOn: admin.firestore.Timestamp(),
                      lastModified: admin.firestore.Timestamp()
                    })
                return prn
              }))
      } else {
        return multipleProductsHandlerRoutine(docRef, storeId, groupId)
      }
    })
}
const generateObjectId = (productUid) => productUid + '_' + Math.random().toString(36).substring(7)
module.exports = {
  invoicePendingStatusToFalse: invoicePendingStatusToFalse,
  productPRN: productPRN,
  objectIDtoProduct: objectIDtoProduct,
  RandomObjectIdToProduct: RandomObjectIdToProduct,
  cloudUrlInStore: cloudUrlInStore,
  multipleProducts: multipleProducts
}
