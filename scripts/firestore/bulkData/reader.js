function readStream (filePath ) {
  var fs = require('fs')
  var readline = require('readline')
  var stream = require('stream')

  var instream = fs.createReadStream(filePath)
  var outstream = new stream()
  var rl = readline.createInterface(instream, outstream)
  rl.on('line', (line) => {
    console.log(line)
  })
  rl.on('close', function () {
    console.log('file eNEd')
  })
}
module.exports = readStream
