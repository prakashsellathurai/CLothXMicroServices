'use strict'
const express = require('express')
const searchRouter = express.Router()
const initIndex = require('./../initIndex')
const ERROR_RESPONSE = require('./shared/error_response_objects')
const GENERATE_FILTER_STRING = require('./shared/generate_filter_string')
searchRouter
  .get('/product',
    (req, res) =>
      res.status(400)
        .json(ERROR_RESPONSE.GET_METHOD_NOT_SUPPORTED))
searchRouter
  .post('/product', (req, res) => {
    let body = req.body
    let query = body.query
    let page = (isDefined(body.page)) ? body.page : 0
    if (typeof query === 'string') {
    //  let reqFilters = (isDefined(body.filters)) ? body.filters : {}
      let reqSortBy = (isDefined(body.sortBy)) ? body.sortBy : null
      //  let occasion = (isDefined(reqFilters.occasion)) ? reqFilters.occasion : ''

      //  query += occasion
      //   const filters = GENERATE_FILTER_STRING._for._post.product(reqFilters)

      let index = sortByProductIndexSelector(reqSortBy)

      return index
        .search({ query: query,
          page: page}/*, filters: filters} */)
        .then((response) => {
          res.json(response.hits)
        })
    } else {
      res.status(400).json(ERROR_RESPONSE.PARAM_IS_UNDEFINED('query'))
    }
  })
searchRouter
  .get('/store',
    (req, res) =>
      res
        .json(ERROR_RESPONSE.GET_METHOD_NOT_SUPPORTED))
searchRouter.post('/store', (req, res) => {
  let reqFilters = req.body.filters
  let reqSortBy = req.body.sortBy
  const query = req.body.query + `${reqFilters.occasion}`

  let storeId = req.body.storeId
  if (typeof query === 'undefined') {
    res.json(ERROR_RESPONSE.PARAM_IS_UNDEFINED('query'))
  } else if (typeof storeId === 'undefined') {
    res.json(ERROR_RESPONSE.PARAM_IS_UNDEFINED('storeId'))
  } else {
    let filters = GENERATE_FILTER_STRING._for._post.store(storeId, reqFilters)

    let index = sortByProductIndexSelector(reqSortBy)
    return index
      .search({query: query, filters: filters})
      .then((response) => {
        res.json(response.hits)
      })
  }
})
searchRouter
  .get('/store',
    (req, res) =>
      res
        .json(ERROR_RESPONSE.GET_METHOD_NOT_SUPPORTED))
searchRouter.post('/store_all', (req, res) => {
  let query = req.body.query
  let storeId = req.body.storeId
  if (typeof query === 'undefined') {
    res.json({error: 'invaild body', error_description: 'query key is undefined'})
  } else if (typeof storeId === 'undefined') {
    res.json({error: 'invaild storeId', error_description: 'storeid is undefined'})
  } else {
    const filters = `storeId:${storeId} AND isDeleted:false`
    let index = initIndex.product.unsorted
    return index
      .search({query: query, filters: filters})
      .then((response) => {
        res.json(response.hits)
      })
  }
})
function sortByProductIndexSelector (reqSortBy) {
  if (reqSortBy === 'high2low') {
    return initIndex.product.sorted.by.price.desc
  } else if (reqSortBy === 'low2high') {
    return initIndex.product.sorted.by.price.asc
  } else if (reqSortBy === 'newest') {
    return initIndex.product.sorted.by.newest
  } else {
    return initIndex.product.unsorted
  }
}
function isDefined (param) {
  return (typeof param !== 'undefined')
}
searchRouter.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send(ERROR_RESPONSE.SERVER_ERROR)
})

module.exports = searchRouter
