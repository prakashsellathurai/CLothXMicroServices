async function readStream (data) {
  let stringify = require('csv-stringify')
  let fs = require('fs')
  let path = require('path')
  let DESTINATION_FILE = path.resolve(__dirname, 'data.csv')
  let columns = await columnEstimator(data)
  console.log("\x1b[34m",columns)
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
  
return data
}
/**
 * formats the firetsore data
 * @param {array} data json data from firetsore
 * @returns {array} data formatted data 
 */
async function dataFormatter(data) {
  
}
/**
 * writes data to the file
 * @param {data} data 
 */
async function dataWriter(data) {
  
}
module.exports = readStream
