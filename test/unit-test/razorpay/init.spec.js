const chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
var expect = chai.expect
let init = require('./../../../functions/shared/environment/initRazorpay')
describe('razorpay client', () => {
  it('should initiate without error', () => {
    expect(() => init.withCredentials()).to.not.throw()
  })
  
})
