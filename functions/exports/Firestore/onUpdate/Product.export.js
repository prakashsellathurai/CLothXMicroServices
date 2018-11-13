const env = require('../../../shared/environment/env')

var functions = require('firebase-functions')
var algoliasearch = require('algoliasearch')
const client = algoliasearch(env.ALGOLIA.appId, env.ALGOLIA.adminApiKey)
const index = client.initIndex('product_search')

function UpdateIndexInAlgolia(doc) {
    doc.objectID = doc.productUid;
    return index.saveObject(doc)
}

module.exports = functions
    .firestore
    .document('products/{productId}')
    .onUpdate((change, context) => UpdateIndexInAlgolia(change.after.data()))
