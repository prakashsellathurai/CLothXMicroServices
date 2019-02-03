'use strict'
// essential imports
const _ = require('lodash')
// GLOBAl CONSTANT
const RESULTS_PER_PAGE = 20
const DISTINCT_PRODUCT_PROPERTY = 'productUid'

// support higher order functions
/**
 * groups the algolia search results
 * @param {Array} AlgoliaData
 * @returns {Array} grouped results
 */
const groupByGroupId = (AlgoliaData) => convertObjToArr((_.groupBy(AlgoliaData, DISTINCT_PRODUCT_PROPERTY)))
const convertObjToArr = (obj) => _.values(obj)

/**
 * merges two array of objects via common member
 * @param {Array} arr1
 * @param {Array} arr2
 * @param {String} member
 */
const merger = (arr1, arr2, member) => [...arr1.concat(arr2).reduce((m, o) => m.set(o[member], Object.assign(m.get(o[member]) || {}, o)), new Map()).values()]
// main functions
/**
 * makes request to the algolia Api
 * @param {number} _index Object representing algolia index to search on
 * @param {string} _query String representing the query passed
 * @param {number} _page page no
 * @param {String} _filters filter String supported by algolia API
 * @returns {Array} results
 */
function makeRequest (_index, _query, _page, _filters) {
  return _index
    .search({
      query: _query,
      filters: _filters,
      page: _page,
      hitsPerPage: 50
    }).then((res) => res.hits)
}
/**
 * makes the search request to algolia and returns the sanitized result
 * @param {number} _index Object representing algolia index to search on
 * @param {string} _query String representing the query passed
 * @param {number} _page page no
 * @param {String} _filters filter String supported by algolia API
 * @param {Array} groupedResults just pass the empty array
 * @returns {Array} results
 */
function mainEngine (_index, _query, _page, _filters, groupedResults) {
  return makeRequest(_index, _query, _page, _filters)
    .then((results) => {
      let normalizeddata = groupByGroupId(results)
      if (normalizeddata.length < RESULTS_PER_PAGE) {
        // do recall here
        // let requiredlength = RESULTS_PER_PAGE - normalizeddata.length
        // return mainEngine(_index, _query, _page + 1, _filters, normalizeddata)
        return normalizeddata
      } else {
        return normalizeddata
      }
    })
}
module.exports = mainEngine
