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
  try {
    let csvString = dataObject.csvString
    let productsInJson = await csv.parseCSV(csvString)
    let validityCheck = await csv.utils.checkProductDataValidity(productsInJson)
    if (validityCheck.statusCode === 400) return validityCheck
    else {
      for (const i in productsInJson) {
        let product = productsInJson[i]
        let StoreData = await db.get.StoreData(product.storeId)
        _.set(productsInJson[i], 'storeDetails', StoreData.storeDetails)
        _.set(productsInJson[i], 'isDeleted', false)
      }
      return db
        .delete
        .productsPostedByStore(productsInJson[0].storeId)
        .then(() =>
          db.set.multipleProducts(productsInJson))
    }
  } catch (e) {
    console.error(e)
    return csv.utils.RESPONSE_CODES.FAILURE('server error', 'please try again after somtime')
  }
}
