const functions = require('firebase-functions')
const express = require('express')
const cors = require('cors')
const app = express()
const algoliaClient = require('../../shared/environment/initAlgoliaClient').withCredentials()
app.use(cors({origin: true}))
app.post('/product_search', (req, res) => {
    let index;

    let reqFilters = req.body.filters
    let reqSortBy = req.body.sortBy
    const query = req.body.query + `${reqFilters.occasion}`

    if (typeof query === 'undefined') {
        res.json({error: 'invaild query', error_description: 'query key is undefined'})
    } else {
        const filters = `isListable:true AND isDeleted:false AND gender: ${reqFilters.categories.gender} AND sellingPrice>=${reqFilters.price.min} AND sellingPrice<=${reqFilters.price.max}`

        if(reqSortBy === 'high2low') {
            index = algoliaClient.initIndex('product_price_desc')
        } else if (reqSortBy === 'low2high'){
            index = algoliaClient.initIndex('product_price_asc')
        } else {
            index = algoliaClient.initIndex('product_search')
        }
        return index
            .search({query: query, filters: filters})
            .then((response) => {
                res.json(response.hits)
            })
    }
})
app.post('/store_search', (req, res) => {
    let index;

    let reqFilters = req.body.filters
    let reqSortBy = req.body.sortBy
    const query = req.body.query + `${reqFilters.occasion}`

    let storeId = req.body.storeId
    if (typeof query === 'undefined') {
        res.json({error: 'invaild query', error_description: 'query  is undefined'})
    } else if (typeof storeId === 'undefined') {
        res.json({error: 'invaild storeId', error_description: 'storeid is undefined'})
    } else {
        const filters = `storeId:${storeId} AND isListable:true AND isDeleted:false AND gender: ${reqFilters.categories.gender} AND size: ${reqFilters.size} AND sellingPrice>=${reqFilters.price.min} AND sellingPrice<=${reqFilters.price.max}`
        if(reqSortBy === 'high2low') {
            index = algoliaClient.initIndex('product_price_desc')
        } else if (reqSortBy === 'low2high'){
            index = algoliaClient.initIndex('product_price_asc')
        } else {
            index = algoliaClient.initIndex('product_search')
        }
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
