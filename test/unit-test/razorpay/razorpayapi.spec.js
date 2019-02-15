const chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
var expect = chai.expect
let api = require('./../../../functions/shared/utils/integrations/razorpay')
let filesToExport = [ 'create', 'get', 'fetch', 'edit', 'cancel', 'utils' ]
describe('razorpayApi', () => {
  it('should export files without error', () => {
    expect(() => api).to.not.throw()
    expect(Object.keys(api)).to.eql(filesToExport)
  })
})
