'use strict'
const neatCsv = require('neat-csv')
/**
 * @params
 */
module.exports = async (csvString) => {
  let jsonData = await neatCsv(csvString)
  return jsonData
}
