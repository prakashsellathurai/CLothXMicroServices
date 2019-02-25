const functions = require('firebase-functions')
const csv = require('./../../../shared/utils/csv')
/**
 * oncall https function generates the csv file for the storeId
 * @param { storeId: String }
 * @async
 * @returns {CSV-String}
 */
module
  .exports = functions
    .https
    .onCall((data, context) => csv
      .generateCSV
      .WithStoreId(data.storeId))
