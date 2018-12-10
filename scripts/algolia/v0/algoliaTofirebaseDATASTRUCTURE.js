let initindex = require('./../../../functions/shared/utils/integrations/algolia/index').initIndex
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
          let offset = (page === 0) ? 0 : RESULTS_PER_PAGE * page - 1
          return recursiveProductAdder(query, filters, unGroupedProducts, offset, requiredNumberOfproducts, 0, 0)
        }
      }
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
        return recursiveProductAdder(query, filters, moreUngroupedProducts, offset, modifiedLength, retryCount, Requiredlength)
        // }
      })
  }
}

mainThread('shirt', 'isListable:true AND isDeleted:false', 1)
  .then(pro => DenormThedata(pro))
  .then((res) => console.log(res))
function DenormThedata (responseArray) {
  return _.forEach(responseArray, function (value) {
    let variantArray = []
    let modifiedv
    _.forEach(value, function (v) {
      let variants = parseVariants(v)
      modifiedv = _.omit(v, ['purchasedPrice', 'sellingPrice', 'objectID', 'size', 'stock'])
      variantArray.push(variants)
    })
    return {
      ...modifiedv,
      variants: variantArray
    }
  })
}
function parseVariants (v) {
  return _.pick(v, ['purchasedPrice', 'sellingPrice', 'objectID', 'size', 'stock'])
}
