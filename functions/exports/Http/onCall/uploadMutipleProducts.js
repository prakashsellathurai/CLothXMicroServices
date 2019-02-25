const functions = require('firebase-functions')
const uploadModule = require('./../../../shared/modules/uploadMultipleProducts.module')
/**
 * oncall https function uploads the products file from the given csv string
 * @param {csvString: String} csvString => products in csv String format
 * @async
 * @returns {Status-code} code representing the status of the csv String posted
 */
module
  .exports = functions
    .https
    .onCall((data, context) => uploadModule(data))
