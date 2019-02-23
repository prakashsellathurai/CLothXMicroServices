'use strict'
const Json2csvParser = require('json2csv').Parser
const _ = require('lodash')
var db = require('./../../firestore/CRUD')

const CSV_TEMPLATE_ABSTRACT = require('./CSV_TEMPLATE_AST')
/**
 * generates csv  from the products posted by store provide
 * given @storeId
 * @param {String} storeId
 * @async
 * @returns {CSV} csv String representing the products file
 */
async function WithStoreId (storeId) {
  let products = await db.get.ProductInStore(storeId)
  let csv = generateCSVString(products)
  return csv
}
/**
 * generates CSV from the  given array of Products
 * @param {Array} products Array of products representing the products
 * @returns {CSV} csv String representing the products file
 */
const generateCSVString = (products) => {
  let ProductDATA = generateProductJSONRows(products)
  try {
    const parser = new Json2csvParser()
    const csv = parser.parse(ProductDATA)
    return csv
  } catch (err) {
    console.error(err)
  }
}
/**
 * geneartes  products in json format
 * @param {array} products
 * @returns {JSON} json document representing the products data
 */
const generateProductJSONRows = (products) => {
  let productsArray = []
  products
    .forEach(product => {
      let ProductRow = generateProductJSONRow(product)
      productsArray.push(ProductRow)
    })
  return productsArray
}
/**
 * generate single product Object
 * @param {Object} product
 * @returns {Object} json-product
 */
const generateProductJSONRow = (product) => {
  let productROW = {}
  for (const PRODUCT_TEMPLATE of CSV_TEMPLATE_ABSTRACT) {
    if (validKeyValue(product, PRODUCT_TEMPLATE.firestore_field)) {
      productROW[`${PRODUCT_TEMPLATE.firestore_field}`] = `${product[PRODUCT_TEMPLATE.firestore_field]}`
    }
  }
  return productROW
}
/**
 * validate Product data with CSV_TEPLATE
 * @param {JSON} product
 * @param {String} firestoreField key representing firestore field stored in CSV_TEMPLATE
 */
const validKeyValue = (product, firestoreField) => _.some(_.intersection([`${firestoreField}`], _.keys(product)))

module.exports = {
  WithStoreId: WithStoreId
}
