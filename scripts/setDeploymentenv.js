'use strict'
process
  .argv
  .slice(2)
  .forEach(function (val, index, array) {
    var obj = {
      production: (val === 'clothxnet'),
      storage: {
        bucket: `${val}.appspot.com`
      },
      databaseURL: `https://${val}.firebaseio.com`
    }
    var path = require('path')
    var json = JSON.stringify(obj)
    var fs = require('fs')
    fs.writeFile(
      path.join(__dirname, './../functions/shared/environment/.deployenv')
      , json
      , 'utf8',
      (err, data) => (err)
        ? console.error('error writing .dotenv file' + err)
        : console.log('\x1b[32m', '\t ✓✓✓✓ environment set sucessfully  \tproject' + ':' + val))
  })
