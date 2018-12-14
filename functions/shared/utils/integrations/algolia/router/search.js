'use strict'
const express = require('express')
const searchRouter = express.Router()
const initIndex = require('./../initIndex')
const ERROR_RESPONSE = require('./shared/error_response_objects')
const GENERATE_FILTER_STRING = require('./shared/generate_filter_string')
const dataParser = require('./shared/algolia_data_parser')
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
      let reqFilters = (isDefined(body.filters) && typeof body.filters === 'object') ? body.filters : {}
      let reqSortBy = (isDefined(body.sortBy)) ? body.sortBy : ''
      let occasion = (isDefined(reqFilters.occasion) && typeof reqFilters.occasion === 'string') ? reqFilters.occasion : ''

      query = query.concat(occasion)

      let filters = GENERATE_FILTER_STRING._for._post.product(reqFilters)
      console.log(filters)
      if (typeof filters === 'string') {
        let index = sortByProductIndexSelector(reqSortBy)
        return dataParser(index, query, page, filters, [])
          .then((response) => res.json(response))
      } else {
        res.status(400).json(ERROR_RESPONSE.INVALID_REQUEST_OBJECT('filters', 'filters in body should not satisfy the server request'))
      }
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
  let body = req.body
  let query = body.query
  let page = (isDefined(body.page)) ? body.page : 0
  let storeId = body.storeId
  if (typeof storeId === 'undefined') {
    res.status(400).json(ERROR_RESPONSE.PARAM_IS_UNDEFINED('storeId'))
  } else {
    if (typeof query === 'string') {
      let reqFilters = (isDefined(body.filters) && typeof body.filters === 'object') ? body.filters : {}
      let reqSortBy = (isDefined(body.sortBy)) ? body.sortBy : ''
      let occasion = (isDefined(reqFilters.occasion) && typeof reqFilters.occasion === 'string') ? reqFilters.occasion : ''

      query = query.concat(occasion)
      let filters = GENERATE_FILTER_STRING._for._post.store(storeId, reqFilters)
      if (typeof filters === 'string') {
        let index = sortByProductIndexSelector(reqSortBy)
        return dataParser(index, query, page, filters, [])
          .then((response) => res.json(response))
      } else {
        res.status(400).json(ERROR_RESPONSE.INVALID_REQUEST_OBJECT('filters', 'filters in body should not satisfy the server request'))
      }
    } else {
      res.status(400).json(ERROR_RESPONSE.PARAM_IS_UNDEFINED('query'))
    }
  }
})
searchRouter
  .get('/store_all',
    (req, res) =>
      res
        .json(ERROR_RESPONSE.GET_METHOD_NOT_SUPPORTED))
searchRouter.post('/store_all', (req, res) => {
  let body = req.body
  let query = body.query
  let page = (isDefined(body.page)) ? body.page : 0
  let storeId = body.storeId
  if (typeof storeId === 'undefined') {
    res.status(400).json(ERROR_RESPONSE.PARAM_IS_UNDEFINED('storeId'))
  } else {
    if (typeof query === 'string') {
      let reqFilters = (isDefined(body.filters) && typeof body.filters === 'object') ? body.filters : {}
      let reqSortBy = (isDefined(body.sortBy)) ? body.sortBy : ''
      let occasion = (isDefined(reqFilters.occasion) && typeof reqFilters.occasion === 'string') ? reqFilters.occasion : ''

      query = query.concat(occasion)
      let filters = GENERATE_FILTER_STRING._for._post.store_all(storeId, reqFilters)
      if (typeof filters === 'string') {
        let index = sortByProductIndexSelector(reqSortBy)
        return dataParser(index, query, page, filters, [])
          .then((response) => res.json(response))
      } else {
        res.status(400).json(ERROR_RESPONSE.INVALID_REQUEST_OBJECT('filters', 'filters in body should not satisfy the server request'))
      }
    } else {
      res.status(400).json(ERROR_RESPONSE.PARAM_IS_UNDEFINED('query'))
    }
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
