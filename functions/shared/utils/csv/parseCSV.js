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
  
  return sanitizeInputJson(jsonData)
}
function sanitizeInputJson (productsInJson) {
  let sanitizedProdcutsArray = []
  for (const product of productsInJson) {
    let sanitizedObject = {}
    for (const key in product) {
      _.set(sanitizedObject, key, product[key])
    }
    sanitizedProdcutsArray.push(sanitizedObject)
  }
  return sanitizedProdcutsArray
}