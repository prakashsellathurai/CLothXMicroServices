//= ===================================== IMPORTS ===============================================//
const db = require('./../../../shared/firestore/CRUD/db')
const env = require('../../../shared/environment/env')

var functions = require('firebase-functions')
const client = algoliasearch(env.ALGOLIA.appId, env.ALGOLIA.adminApiKey)
var algoliasearch = require('algoliasearch')
const index = client.initIndex('product_search')

function PrnAssigner (context) {
  let productId = context.params.productId
     return db.prnCheckLoop()
        .then(rand => db.SetProductPRN(productId, rand))


}
function IndexItInAlgolia (snap) {
    const data = snap.data()
    const objectId = snap.id

    //Add the data to the algolia index
    return index.addObject({
        objectId,
        data
    })
}
function MainHandler (snap, context) {
    return PrnAssigner(context)
    .then(() => IndexItInAlgolia(snap))
}
// ==================================================================================================
// =====================================export module================================================
module.exports = functions
  .firestore
  .document('/products/{productId}')
  .onCreate((snap, context) => MainHandler(snap, context))
