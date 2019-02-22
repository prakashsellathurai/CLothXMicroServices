'use strict'
var db = require('./../../firestore/CRUD')
const createCsvStringifier = require('csv-writer')
  .createObjectCsvStringifier
const HEADERS = [
  'PRODUCT_UID',
  'PRN',
  'PRODUCT_NAME',
  'BRAND_NAME',
  'DESCRIPTION',
  'SELLING_PRICE',
  'PURCHASED_PRICE',
  'STORE_ID',
  'TAX_IN_PERCENTAGE',
  'SOLD',
  'STOCK',
  'MARGIN_IN_PERCENTAGE',
  'CATEGORIES',
  'ATTRIBUTES_VALUES',
  'ATTRIBUTES_TEMPLATES',
  'IS_VARIANTS_WITH_SAME_PRICE_AND_TAX'
]

const _ = require('lodash')
const joi = require('joi')

const objectSchema = joi.object({
  source: joi.string().min(1).required(),
  path: joi.string().min(1).required()
}).required()

const arraySchema = joi.array().items(objectSchema)

const csvStringifier = createCsvStringifier({
  header: HEADERS
})
async function WithStoreId (storeId) {
  let products = await db.get.ProductInStore(storeId)
  generateCSVString(products)
  return products
}
function generateCSVString (products) {
  console.log(_.keys(products[0]))
  console.log(_.values(products[0]))
}
function validateProducts (products) {
  let arrayResult = joi.validate(products, arraySchema)
  return arrayResult
}
module.exports = {
  WithStoreId: WithStoreId
}
