let initindex = require('./../../index').initIndex
let productIndex = initindex.product.unsorted
const _ = require('lodash')
const RESULTS_PER_PAGE = 20

const groupByProductUid = (AlgoliaData) => convertObjToArr(_.mapValues(_.groupBy(AlgoliaData, 'productUid')))
const convertObjToArr = (obj) => _.values(obj)
const GetProductBypage = (query, filters, page) => productIndex
  .search({
    query: query,
    filters: filters,
    page: page,
    hitsPerPage: RESULTS_PER_PAGE
  }).then((content) => content.hits)
const GetProductByOffsetAndLength = (query, filters, offset, length) => productIndex
  .search({
    query: query,
    filters: filters,
    offset: offset,
    length: length,
    hitsPerPage: RESULTS_PER_PAGE
  }).then((content) => content.hits)

function mainThread (query, filters, page) {
  return GetProductBypage(query, filters, page)
    .then((unGroupedProducts) => {
      let groupedProducts = groupByProductUid(unGroupedProducts)

      if (unGroupedProducts.length < RESULTS_PER_PAGE) {
        return groupedProducts
      } else if (unGroupedProducts.length === RESULTS_PER_PAGE) {
        if (groupedProducts.length === RESULTS_PER_PAGE) {
          return groupedProducts
        } else if (groupedProducts.length < RESULTS_PER_PAGE) {
          let groupedProductsLength = groupedProducts.length
          let requiredNumberOfproducts = RESULTS_PER_PAGE - groupedProductsLength
          console.log('REQUIRED PRODUCTS ' + requiredNumberOfproducts)
          let offset = (page === 0) ? 0 : RESULTS_PER_PAGE * page - 1
          return recursiveProductAdder(query, filters, unGroupedProducts, offset, requiredNumberOfproducts, 0, 0)
        }
      }
    }).then((response) => {

    })
}
function DenormThedata (responseArray) {
    _.forEach(responseArray,function(value) {
        console.log()
    })
}
function recursiveProductAdder (query, filters, ungroupedProducts, offset, length, retryCount, previousValue) {
  let groupedProducts = groupByProductUid(ungroupedProducts)
  let groupedProductsLength = groupedProducts.length

  if (groupedProductsLength >= RESULTS_PER_PAGE || groupedProductsLength === 0) {
    return groupedProducts
  } else if (groupedProductsLength < RESULTS_PER_PAGE) {
    return GetProductByOffsetAndLength(query, filters, offset, length)
      .then((moreUngroupedProducts) => {
        moreUngroupedProducts = _.unionBy(ungroupedProducts, moreUngroupedProducts)

        let MoreGroupedProducts = groupByProductUid(moreUngroupedProducts)
        let MoreGroupedProductsLength = MoreGroupedProducts.length
        let Requiredlength = RESULTS_PER_PAGE - MoreGroupedProductsLength
        let modifiedLength = length + Requiredlength

        if (Requiredlength === 0) {
          return MoreGroupedProducts
        }
        if (Requiredlength - previousValue === 0) {
          retryCount += 1
        }
        if (retryCount > 7) {
          return MoreGroupedProducts
        }
        console.log('previous value' + previousValue)
        console.log('retry count' + retryCount)
        console.log(Requiredlength + ': len :' + MoreGroupedProducts.length)
        return recursiveProductAdder(query, filters, moreUngroupedProducts, offset, modifiedLength, retryCount, Requiredlength)
        // }
      })
  }
}
module.exports = {
  mainThread: mainThread
}
