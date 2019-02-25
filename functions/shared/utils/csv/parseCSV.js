'use strict'
const neatCsv = require('neat-csv')
const csvTemplate = require('./CSV_TEMPLATE_AST')
const _ = require('lodash')
/**
 * @params
 */
module.exports = async (csvString) => {
  let jsonData = await neatCsv(csvString)

  jsonData
    .forEach(product => {
      csvTemplate
        .forEach(template => {
          _.set(product, template.firestore_field, _.get(product, template.csv_header))
          delete product[template.csv_header]
        })
    })
  return jsonData
}
