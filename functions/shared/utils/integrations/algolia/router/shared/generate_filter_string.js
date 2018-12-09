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
            filterString += `AND size: ${reqFilters.size} `
          }
          if (reqFilters.hasOwnProperty('price')) {
            if (reqFilters.price.hasOwnProperty('min')) {
              filterString += `AND sellingPrice>=${reqFilters.price.min}`
            }
            if (reqFilters.price.hasOwnProperty('min')) {
              filterString += `AND sellingPrice<=${reqFilters.price.max}`
            }
          }
          filterString = filterString.trim() // remove whitespace

          return filterString
        }
      },
      store: (storeId, reqFilters) => {
        return `storeId:${storeId}` +
        ` AND isListable:true AND isDeleted:false ` +
         `AND gender: ${reqFilters.categories.gender}` +
          `AND size: ${reqFilters.size}` +
           ` AND sellingPrice>=${reqFilters.price.min}` +
             ` AND sellingPrice<=${reqFilters.price.max}`
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
