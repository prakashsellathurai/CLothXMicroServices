//= ===================================== IMPORTS ===============================================//
var functions = require('firebase-functions')
var algoliasearch = require('algoliasearch')
const env = require('../../../shared/environment/CONSTANTS');

const client = algoliasearch(env.ALGOLIA.appId, env.ALGOLIA.adminApiKey)
const index = client.initIndex('product_search')


function DeleteIndexInAlgolia (snap) {
    const objectId = snap.id

    //Delete data in the algolia index
    return index.deleteObject(objectId)
}
// ==================================================================================================
// =====================================export module================================================
module.exports = functions
    .firestore
    .document('/products/{productId}')
    .onDelete((snap, context) => DeleteIndexInAlgolia(snap)
    )
