const chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
var expect = chai.expect
let init = require('./../../../functions/shared/environment/initRazorpay')
describe('razorpay client', () => {
  it('should initiate without error', () => {
    expect(() => init.withCredentials()).to.not.throw()
  })
  it('should have razorpay instance properties', () => {
    let instance = init.withCredentials()
    let properties = [
      'payments',
      'refunds',
      'orders',
      'customers',
      'transfers',
      'virtualAccounts',
      'invoices',
      'plans',
      'subscriptions',
      'addons'
    ]
    properties.forEach(property => {
      expect(instance).to.have.property(property)
    })
  })
})
