'use strict'
module.exports = {
  _for: {
    _post: {
      product: (reqFilters) => {
        return `isListable:true` +
            `AND isDeleted:false` +
             ((reqFilters.categories.gender) ? `AND gender:${reqFilters.categories.gender}` : ``) +
             (`${reqFilters.size}` ? `AND size: ${reqFilters.size} ` : ``) +
               (`${reqFilters.price.min}` ? `AND sellingPrice>=${reqFilters.price.min}` : ``) +
                (`${reqFilters.price.max}` ? `AND sellingPrice<=${reqFilters.price.max}` : ``)
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
