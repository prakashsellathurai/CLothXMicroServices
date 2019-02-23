'use strict'
// essential imports
const _ = require('lodash')
// GLOBAl CONSTANT
const DISTINCT_PRODUCT_PROPERTY = 'groupId'

// support higher order functions
/**
 * groups the algolia search results
 * @param {Array} AlgoliaData
 * @returns {Array} grouped results
 */
const groupByGroupId = (AlgoliaData) => convertObjToArr(_.groupBy(AlgoliaData, DISTINCT_PRODUCT_PROPERTY))
/**
 * converts object into array
 * @param {object} obj
 */
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
 * @async
 * @returns {Array} results
 */
async function makeRequest (_index, _query, _page, _filters) {
  try {
    let res = await _index.search({
      query: _query,
      filters: _filters,
      page: _page,
      hitsPerPage: 50
    })
    return res.hits
  } catch (e) {
    if (e) {
      console.error(e)
      return []
    }
  }
}
/**
 * makes the search request to algolia and returns the sanitized result
 * @param {number} _index Object representing algolia index to search on
 * @param {string} _query String representing the query passed
 * @param {number} _page page no
 * @param {String} _filters filter String supported by algolia API
 * @param {Array} groupedResults just pass the empty array
 * @async
 * @returns {Array} results
 */
async function mainEngine (_index, _query, _page, _filters) {
  let results = await makeRequest(_index, _query, _page, _filters)
  // @depreceted let normalizeddata = groupByGroupId(results)
  console.log(results)
  return results
}
module.exports = mainEngine
