'use strict'
module.exports = {
  _for: {
    _post: {
      product: (reqFilters) => {
        let filterString = `isListable:true AND isDeleted:false`
        if (isEmptyObj(reqFilters)) {
          return filterString
        } else {
          if (reqFilters.hasOwnProperty('categories')) {
            if (reqFilters.categories.hasOwnProperty('gender') && typeof reqFilters.categories.gender === 'string') {
              filterString += ConcatfacetWithAND(`gender:${reqFilters.categories.gender}`)
            }
          }
          if (reqFilters.hasOwnProperty('size')) {
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
      },
      store: (storeId, reqFilters) => {
        let filterString = `storeId:${storeId} AND isDeleted:false`
        if (isEmptyObj(reqFilters)) {
          return filterString
        } else {
          if (reqFilters.hasOwnProperty('categories')) {
            if (reqFilters.categories.hasOwnProperty('gender') && typeof reqFilters.categories.gender === 'string') {
              filterString += ConcatfacetWithAND(`gender:${reqFilters.categories.gender}`)
            }
          }
          if (reqFilters.hasOwnProperty('size')) {
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
      },

      store_all: (storeId, reqFilters) => {
        let filterString = `storeId:${storeId}`
        if (isEmptyObj(reqFilters)) {
          return filterString
        } else {
          if (reqFilters.hasOwnProperty('categories')) {
            if (reqFilters.categories.hasOwnProperty('gender') && typeof reqFilters.categories.gender === 'string') {
              filterString += ConcatfacetWithAND(`gender:${reqFilters.categories.gender}`)
            }
          }
          if (reqFilters.hasOwnProperty('size')) {
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
// algolia filter need spaces
