'use strict'
module.exports = {
  _for: {
    _post: {
      product: (reqFilters) => {
        let filterString = `isListable:true AND isDeleted:false`
        return filterDeterminantEngine(reqFilters, filterString)
      },
      store: (storeId, reqFilters) => {
        let filterString = `storeId:${storeId} AND isDeleted:false`
        return filterDeterminantEngine(reqFilters, filterString)
      },

      store_all: (storeId, reqFilters) => {
        let filterString = `storeId:${storeId}`
        return filterDeterminantEngine(reqFilters, filterString)
      }
    }
  }
}
function isEmptyObj (obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) { return false }
  }

  return true
}
function ConcatfacetWithAND (facet) {
  return ' ' + 'AND' + ' ' + `${facet}`
}
function StringTest (str) {
  return str !== '' && str !== null && str !== undefined && (str.length > 0)
}
function filterDeterminantEngine (reqFilters, filterString) {
  if (isEmptyObj(reqFilters)) {
    return filterString
  } else {
    if (reqFilters.hasOwnProperty('categories') && StringTest(reqFilters.categories)) {
      if (reqFilters.categories.hasOwnProperty('gender') && typeof reqFilters.categories.gender === 'string' && StringTest(reqFilters.categories.gender)) {
        filterString += ConcatfacetWithAND(`gender:${reqFilters.categories.gender}`)
      }
    }
    if (reqFilters.hasOwnProperty('size') && StringTest(reqFilters.size)) {
      filterString += ConcatfacetWithAND(`size: ${reqFilters.size}`)
    }
    if (reqFilters.hasOwnProperty('price')) {
      if (reqFilters.price.hasOwnProperty('min') && typeof reqFilters.price.min === 'number') {
        filterString += ConcatfacetWithAND(`sellingPrice>=${reqFilters.price.min}`)
      }
      if (reqFilters.price.hasOwnProperty('max') && typeof reqFilters.price.max === 'number') {
        filterString += ConcatfacetWithAND(`sellingPrice<=${reqFilters.price.max}`)
      }
    }

    return filterString
  }
}
// algolia filter need spaces
