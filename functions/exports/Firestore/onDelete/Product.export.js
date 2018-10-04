//= ===================================== IMPORTS ===============================================//
var functions = require('firebase-functions')
import * as algoliasearch from 'algoliasearch';

const client = algoliasearch(env.algolia.appId, env.algolia.apiKey)
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
    .onDelete((snap, context) => {
        DeleteIndexInAlgolia(snap)
    })
