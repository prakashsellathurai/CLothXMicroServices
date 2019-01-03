'use strict'
// essential imports
const _ = require('lodash')
// GLOBAl CONSTANT
const RESULTS_PER_PAGE = 20
const DISTINCT_PRODUCT_PROPERTIES = ['purchasedPrice', 'sellingPrice', 'objectID', 'size', 'stock']
// support higher order functions
const groupByProductUid = (AlgoliaData) => convertObjToArr(_.mapValues(_.groupBy(AlgoliaData, 'productUid')))
const convertObjToArr = (obj) => _.values(obj)
const parseVariants = (v) => _.pick(v, DISTINCT_PRODUCT_PROPERTIES)
const merger = (arr1, arr2, member) => [...arr1.concat(arr2).reduce((m, o) => m.set(o[member], Object.assign(m.get(o[member]) || {}, o)), new Map()).values()]
// main functions
function dataNormalizer (dataArray) {
  let normalizedArray = []
  dataArray.forEach(dataGroup => {
    let refinedObject = {}
    let variants = []
    dataGroup.forEach(element => {
      let variant = parseVariants(element)
      if (variant.stock !== 0) {
        variants.push(variant)
      }
    })
    refinedObject = _.cloneDeep(_.omit(dataGroup[0], DISTINCT_PRODUCT_PROPERTIES))
    refinedObject['variants'] = variants
    normalizedArray.push(refinedObject)
  })
  return normalizedArray
}
function makeRequest (_index, _query, _page, _filters) {
  return _index
    .search({
      query: _query,
      filters: _filters,
      page: _page,
      hitsPerPage: 50
    }).then((res) => res.hits)
}
function mainEngine (_index, _query, _page, _filters, groupedResults) {
  return makeRequest(_index, _query, _page, _filters)
    .then((results) => {
      console.log(results.length)
      let normalizeddata = merger(groupedResults, dataNormalizer(groupByProductUid(results)), 'productUid')
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
