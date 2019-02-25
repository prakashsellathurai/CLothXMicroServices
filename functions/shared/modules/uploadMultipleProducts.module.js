'use strict'
const csv = require('./../../shared/utils/csv')
const db = require('./../../shared/firestore/CRUD')
const _ = require('lodash')

/**
 * @module uploadMultipleProducts
 * the module handles the multiple products uploaded through the csv String passed via the data object
 * @param {csvString: String}
 * @returns {RESPONSE_CODES}
 */
module.exports = async (dataObject) => {
  if (!_.has(dataObject, 'csvString')) return csv.utils.RESPONSE_CODES.FAILURE('csv String not provided', 'csv String field is undefined')
  else if (typeof dataObject.csvString !== 'string') return csv.utils.RESPONSE_CODES.FAILURE('invalid datatype', 'provide csv string data')
  else {
    try {
      let csvString = dataObject.csvString
      let productsInJson = await csv.parseCSV(csvString)
      let validityCheck = await csv.utils.checkProductDataValidity(productsInJson)
      if (validityCheck.statusCode === 400) return validityCheck
      else {
        for (const i in productsInJson) {
          let product = productsInJson[i]
          let StoreData = await db.get.StoreData(product.storeId)
          let storeDetails = {
            address: (StoreData.address || {}),
            location: (StoreData.location || ''),
            name: (StoreData.storeName || '')
          }
          _.set(productsInJson[i], 'storeDetails', storeDetails)
          _.set(productsInJson[i], 'isDeleted', false)
          let sellingPrice = _.get(productsInJson[i], 'sellingPrice')
          let purchasedPrice = _.get(productsInJson[i], 'purchasedPrice')
          if (typeof sellingPrice !== 'undefined' && typeof purchasedPrice !== 'undefined') _.set(productsInJson[i], 'marginInPercentage', _.divide(sellingPrice, purchasedPrice))
        }
        return db
          .delete
          .productsPostedByStore(productsInJson[0].storeId)
          .then(() =>
            db.set.multipleProducts(productsInJson))
          .then(() => csv.utils.RESPONSE_CODES.SUCCESS)
      }
    } catch (e) {
      console.error(e)
      return csv.utils.RESPONSE_CODES.FAILURE('server error', 'please try again after somtime')
    }
  }
}
