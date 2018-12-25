function readStream (data) {
  let stringify = require('csv-stringify')
  let fs = require('fs')
  let path = require('path')
  let DESTINATION_FILE = path.resolve(__dirname, 'data.csv')
  let columns = {}
  for (let item of Object.keys(data[0])) {
    columns[item] = item
  }

  stringify(data, { header: true, columns: columns }, (err, output) => {
    if (err) throw err
    fs.writeFile(DESTINATION_FILE, output, (err) => {
      if (err) throw err
      console.log('my.csv saved.')
    })
  })
}
module.exports = readStream
