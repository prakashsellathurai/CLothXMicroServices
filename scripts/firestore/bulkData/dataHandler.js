const _ = require('lodash')
const FILTER_FIELDS = [
  'cloudinaryUrl',
  'isDeleted',
  'addedBy',
  'hasNoGstNumber',
  'isvariantsWithSamePrice',
  'isVariantsWithSamePrice',
  'productUid',
  'cloudinaryUrls',
  'views',
  'isListable',
  'picturesPath'
]
async function readStream (data) {
  let stringify = require('csv-stringify')
  let fs = require('fs')
  let path = require('path')
  let DESTINATION_FILE = path.resolve(__dirname, 'data.csv')
  let columns = await columnEstimator(data)
  console.log(columns)
  data = await dataFormatter(data)
  return dataWriter(data)

  // stringify(data, { header: true, columns: columns }, (err, output) => {
  //   if (err) throw err
  //   fs.writeFile(DESTINATION_FILE, output, (err) => {
  //     if (err) throw err
  //     console.log('my.csv saved.')
  //   })
  // })
}
/**
 * estimates the column
 * @param {array} data json data from firestore
 * @returns {array} column required number of columns
 */
async function columnEstimator (data) {
  let maxlength = 0
  let columnns = []
  let clearance = 0
  for (let product of data) {
    let length = await keyCalculator(product)
    columnns = _.union(columnns, _.keys(product))
    maxlength = (maxlength > length) ? maxlength : length
    clearance = maxlength - length
  }
  columnns = _.difference(columnns, FILTER_FIELDS)
  columnns = _.sortBy(columnns, (o) => o.charCodeAt(0))
  let columnnsLength = columnns.length + clearance
  console.log(columnnsLength)
  return columnns
}
/**
 * calculates the key length of product data
 * @param {object} product data
 * @returns {number} key length of the product data
 */
async function keyCalculator (product) {
  let length = 0
  for (const key in product) {
    if (product.hasOwnProperty(key)) {
      const element = product[key]
      if (key === 'variants') {
        length += element.length
      } else {
        length += 1
      }
    }
  }

  return length
}
/**
 * formats the firetsore data
 * @param {array} data json data from firetsore
 * @returns {array} data formatted data
 */
async function dataFormatter (data) {

}
/**
 * writes data to the file
 * @param {data} data
 */
async function dataWriter (data) {

}
module.exports = readStream
