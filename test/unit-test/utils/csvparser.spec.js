var it = require('mocha').it
var describe = require('mocha').describe

let csv = require('./../../../functions/shared/utils/csv')

describe('csv generator', function () {
  it('should generate csv', async function () {
    let generate = await csv.generateCSV.WithStoreId('eIGNV5kDx1JuMCn3td3W')
  })
})

describe('csv parser', function () {
  it('should parse csv', function () {

  })
})
