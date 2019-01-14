const chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
let assert = chai.assert
var expect = chai.expect
let admin = require('./../../../functions/shared/environment/initAlgoliaClient').withCredentials()
describe('algolia client', () => {
  it('should intiate without error', () => {
    expect(() => admin).to.not.throw()
  })
})
