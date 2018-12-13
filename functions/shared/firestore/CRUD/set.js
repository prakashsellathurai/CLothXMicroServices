let admin = require('firebase-admin')
let firestore = admin.firestore()
let update = require('./update')
let utils = require('./../utils/index')

function invoicePendingStatusToFalse (invoiceId) {
  return update.invoicePendingStatus(invoiceId, 'false')
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
function RandomObjectIdToProduct (productId) {
  let productDocRef = firestore
    .doc(`/products/${productId}`)
  return firestore
    .runTransaction(t => {
      return t.get(productDocRef)
        .then((doc) => {
          let data = doc.data()
          let productUid = data.productUid
          let variants = data.variants
          for (let index = 0; index < variants.length; index++) {
            variants[index].objectID = productUid + '_' + index
          }
          return utils.prnCheckLoop()
            .then((prn) => {
              t.set(doc.ref, {
                prn: prn,
                variants: variants,
                createdOn: admin.firestore.FieldValue.serverTimestamp()
              }, { merge: true })
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
  RandomObjectIdToProduct: RandomObjectIdToProduct
}
