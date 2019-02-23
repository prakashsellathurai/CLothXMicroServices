var it = require('mocha').it
var describe = require('mocha').describe
var expect = require('chai').expect

let csv = require('../../../functions/shared/utils/csv')

describe('csv generator', function () {
  it('should generate csv with given store their having products posted', async function () {
    let generatedCSV = await csv.generateCSV.WithStoreId('eIGNV5kDx1JuMCn3td3W')
    let isCSV = csv.validateCSV(generatedCSV)
    expect(isCSV).to.eql(true)
  })
  it('should generate csv with store post the products for the first time', async function () {
    let generatedCSV = await csv.generateCSV.WithStoreId('8mLZEPfE0rowuNJAqINj')
    console.log(generatedCSV)
    let isCSV = csv.validateCSV(generatedCSV)
    expect(isCSV).to.eql(true)
  })
})

describe('csv parser', function () {
  it('should parse csv', function () {

  })
})
