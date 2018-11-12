const functions = require('firebase-functions')
const express = require('express')
const cors = require('cors')
const app = express()
const algoliaClient = require('../../shared/environment/initAlgoliaClient').withCredentials()
app.use(cors({origin: true}))
app.post('/product_search', (req, res) => {
    const query = JSON.parse(req.body.query)
    const filters = 'isListable:true AND isDeleted:false'
    let index = algoliaClient.initIndex('product_search')
    return index
        .search({query: query, filters: filters})
        .then((response) => {
            res.json(response.hits)
        })
})
app.post('/store_search', (req, res) => {
    const query = JSON.parse(req.body.query)
    const filters = `storeId:${req.body.storeId} AND isListable:true AND isDeleted:false`
    let index = algoliaClient.initIndex('product_search')
    return index
        .search({query: query, filters: filters})
        .then((response) => {
            res.json(response.hits)
        })
})
app.post('/store_search_all', (req, res) => {
    const query = JSON.parse(req.body.query)
    const filters = `storeId:${req.body.storeId} AND isDeleted:false`
    let index = algoliaClient.initIndex('product_search')
    return index
        .search({query: query, filters: filters})
        .then((response) => {
            res.json(response.hits)
        })
})
module.exports = functions.https.onRequest(app)
