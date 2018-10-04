//= ===================================== IMPORTS ===============================================//
var functions = require('firebase-functions')
const db = require('./../../../shared/firestore/CRUD/db')
var algoliasearch = require('algoliasearch')

const client = algoliasearch(env.algolia.appId, env.algolia.apiKey)
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
        ...data
    })
}
// ==================================================================================================
// =====================================export module================================================
module.exports = functions
  .firestore
  .document('/products/{productId}')
  .onCreate((snap, context) => {
        PrnAssigner(context)
            .then(() => IndexItInAlgolia(snap))

  })
