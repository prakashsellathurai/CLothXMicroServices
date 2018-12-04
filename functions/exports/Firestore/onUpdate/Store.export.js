const functions = require('firebase-functions')
const algolia = require('./../../../shared/utils/integrations/algolia/index')
const storeIndex = algolia.initIndex.store

module.exports = functions
  .firestore
  .document('stores/{storeId}')
  .onUpdate((change, context) => {
    const document = change.after.data()
    const dataForalgolia = document
    dataForalgolia.objectID = context.params.storeId
    return storeIndex
      .saveObject(dataForalgolia)
  })
