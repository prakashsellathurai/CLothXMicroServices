const functions = require('firebase-functions')
const express = require('express')
const cors = require('cors')
const app = express()
const algoliaClient = require('../../shared/environment/initAlgoliaClient').withCredentials()
app.use(cors({origin: true}))
app.post('/product_search', (req, res) => {
    let query = req.body.query
    let filters = req.body.filters
    let sortBy = req.body.sortBy
    if (typeof query === 'undefined') {
        res.json({error: 'invaild query', error_description: 'query key is undefined'})
    } else {
        const filters = `isListable:true AND isDeleted:false AND gender: ${filters.gender}`
        let index = algoliaClient.initIndex('product_search')
        return index
            .search({query: query, filters: filters})
            .then((response) => {
                res.json(response.hits)
            })
    }
})
app.post('/store_search', (req, res) => {
    let query = req.body.query
    let storeId = req.body.storeId
    if (typeof query === 'undefined') {
        res.json({error: 'invaild query', error_description: 'query  is undefined'})
    } else if (typeof storeId === 'undefined') {
        res.json({error: 'invaild storeId', error_description: 'storeid is undefined'})
    } else {
        const filters = `storeId:${storeId} AND isListable:true AND isDeleted:false`
        let index = algoliaClient.initIndex('product_search')
        return index
            .search({query: query, filters: filters})
            .then((response) => {
                res.json(response.hits)
            })
    }
})
app.post('/store_search_all', (req, res) => {
    let query = req.body.query
    let storeId = req.body.storeId
    if (typeof query === 'undefined') {
        res.json({error: 'invaild body', error_description: 'query key is undefined'})
    } else if (typeof storeId === 'undefined') {
        res.json({error: 'invaild storeId', error_description: 'storeid is undefined'})
    } else {
        const filters = `storeId:${storeId} AND isDeleted:false`
        let index = algoliaClient.initIndex('product_search')
        return index
            .search({query: query, filters: filters})
            .then((response) => {
                res.json(response.hits)
            })
    }
})
module.exports = functions.https.onRequest(app)
