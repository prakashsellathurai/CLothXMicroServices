const chai = require('chai')
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
let admin = require('./../../../functions/shared/environment/initAdmin').setCredentials()
let db = require('../../../functions/shared/firestore/CRUD/index')
const assert = chai.assert
var expect = chai.expect
let test_data = {
  storeId: 'o5TJXffUXswTmtpEmYcY',
  user_UID: 'w2DUjxHxBIQCuYg4LB0ZlALpD7r2',
  userEmail: 'nponmuthuselvam@gmail.com'
}
describe('firebase admin sdk', () => {
  it('should intiliaze admin', () => {
    expect(() => admin).to.not.throw()
  })
})
describe('db', async () => {
  describe('#firestore', function () {
    let firestore = admin.firestore()
    it('should have collection property', () => {
      expect(firestore).to.have.property('collection')
    })
    it('should have doc property', () => {
      expect(firestore).to.have.property('doc')
    })
  })

  describe('#associate store info to user()', function () {
    it('should complete the execution', () => {
      let operation = db
        .associate
        .storeInfoToUser(test_data.user_UID, test_data.storeId)
      expect(operation).to.eventually.fulfilled
    })
    it('should return a valid email', async () => {
      let email = await db
        .associate
        .storeInfoToUser(test_data.user_UID, test_data.storeId)
      expect(email).to.equal(test_data.userEmail)
    })
  
  })
})
